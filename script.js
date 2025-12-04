const API_URL = "http://localhost:3000/api";

let cart = [];
let currentUser = null;
let authToken = null;

document.addEventListener("DOMContentLoaded", () => {
  restoreAuth();
  renderUserInfo();
  fetchProducts();
  loadCart();
  attachEvents();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function restoreAuth() {
  const u = localStorage.getItem("ps_user");
  const t = localStorage.getItem("ps_token");
  if (u && t) {
    currentUser = JSON.parse(u);
    authToken = t;
  }
}

function saveAuth(user, token) {
  localStorage.setItem("ps_user", JSON.stringify(user));
  localStorage.setItem("ps_token", token);
}

function logout() {
  localStorage.removeItem("ps_user");
  localStorage.removeItem("ps_token");
  currentUser = null;
  authToken = null;
  alert("Logged out!");
  window.location = "login.html";
}

function renderUserInfo() {
  const box = document.getElementById("user-info");
  const logoutBtn = document.getElementById("logout-btn");

  if (!currentUser) {
    box.textContent = "Not logged in";
    logoutBtn.style.display = "none";
  } else {
    box.textContent = `${currentUser.email} (${currentUser.role})`;
    logoutBtn.style.display = "inline-block";
    if (currentUser.role === "admin") loadAdminOrders();
  }
}

async function fetchProducts() {
  const list = document.getElementById("product-list");
  list.textContent = "Loading...";

  const res = await fetch(API_URL + "/products");
  const products = await res.json();

  list.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image" style="background-image:url('${p.imageUrl}')"></div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="product-price">€${p.price.toFixed(2)}</div>
      <button class="btn-primary">Add to Cart</button>
    `;

    card.querySelector("button").onclick = () => {
      addToCart({ id: p.id, name: p.name, price: p.price });
    };

    list.appendChild(card);
  });
}

function loadCart() {
  const stored = localStorage.getItem("ps_cart");
  if (stored) cart = JSON.parse(stored);
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("ps_cart", JSON.stringify(cart));
}

function addToCart(product) {
  const item = cart.find((i) => i.id === product.id);
  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });

  saveCart();
  updateCartCount();
  renderCart();
  openCart();
}

function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCart() {
  const box = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");

  if (cart.length === 0) {
    box.innerHTML = "<p>Your cart is empty.</p>";
    totalBox.textContent = "0.00";
    return;
  }

  box.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cost = item.price * item.qty;
    total += cost;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div><strong>${item.name}</strong> × ${item.qty}</div>
      <div>
        €${cost.toFixed(2)}
        <button class="remove-btn">Remove</button>
      </div>
    `;

    div.querySelector(".remove-btn").onclick = () => {
      cart = cart.filter((i) => i.id !== item.id);
      saveCart();
      updateCartCount();
      renderCart();
    };

    box.appendChild(div);
  });

  totalBox.textContent = total.toFixed(2);
}

async function checkout() {
  if (!currentUser) return window.location = "login.html";
  if (cart.length === 0) return alert("Cart empty!");

  const res = await fetch(API_URL + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken
    },
    body: JSON.stringify({
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    })
  });

  if (!res.ok) return alert("Checkout failed");

  alert("Order placed!");
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
}

async function loadAdminOrders() {
  const box = document.getElementById("admin-orders");
  if (!box) return;

  const res = await fetch(API_URL + "/orders", {
    headers: { Authorization: "Bearer " + authToken }
  });

  if (!res.ok) {
    box.innerHTML = "<p>Failed to load orders.</p>";
    return;
  }

  const orders = await res.json();
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  let html = `
    <table>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Total</th>
        <th>Status</th>
        <th>Time</th>
      </tr>
  `;

  orders.forEach(o => {
    html += `
      <tr>
        <td>${o.id}</td>
        <td>${o.email}</td>
        <td>€${o.total.toFixed(2)}</td>
        <td>
          <select data-id="${o.id}" class="status-select">
            ${statuses.map(s => `<option ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </td>
        <td>${new Date(o.createdAt).toLocaleString()}</td>
      </tr>
    `;
  });

  html += "</table>";
  box.innerHTML = html;

  document.querySelectorAll(".status-select").forEach(sel => {
    sel.onchange = async () => {
      const id = sel.dataset.id;
      const status = sel.value;

      await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken
        },
        body: JSON.stringify({ status })
      });

      alert("Status updated.");
    };
  });
}

function attachEvents() {
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (cartBtn) cartBtn.onclick = openCart;
  if (closeCartBtn) closeCartBtn.onclick = closeCart;
  if (checkoutBtn) checkoutBtn.onclick = checkout;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.onclick = logout;

  const backdrop = document.getElementById("cart-backdrop");
  if (backdrop) backdrop.onclick = closeCart;
}

function openCart() {
  document.getElementById("cart-modal").classList.remove("hidden");
  document.getElementById("cart-backdrop").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
  document.getElementById("cart-backdrop").classList.add("hidden");
}
