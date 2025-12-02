
const products = [
  {
    id: 1,
    name: "Squeaky Bone Toy",
    description: "Durable rubber bone that squeaks. Perfect for fetch.",
    price: 7.99,
    image: "data:image/jpeg;base64,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"
  },
  {
    id: 2,
    name: "Rope Tug Toy",
    description: "Strong cotton rope to play tug-of-war.",
    price: 9.5,
    image: "https://www.petscorner.co.uk/Images/Product/Default/xlarge/great-small-rope-knot-ball-tug-46cm-1.jpg"
  },
  {
    id: 3,
    name: "Treat Puzzle Ball",
    description: "Interactive ball that dispenses treats for mental play.",
    price: 14.25,
    image: "https://www.durapaw.ca/cdn/shop/products/DurableRubberDogToyTreatDispenserCanada.jpg?v=1734886701"
  },
  {
    id: 4,
    name: "Plush Duck Toy",
    description: "Soft plush toy with squeaker, ideal for gentle chewers.",
    price: 8.75,
    image: "https://i5.walmartimages.com/asr/51c99f5a-28a8-412c-b802-963bd41c6e01.b836fc339d457fe79e1f15bdb9df2bbf.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"
  }
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  loadCartFromStorage();
  attachCartEvents();

  document.getElementById("year").textContent = new Date().getFullYear();
});

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(prod => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image" style="background-image:url('${prod.image}')"></div>
      <h3 class="product-title">${prod.name}</h3>
      <p class="product-description">${prod.description}</p>
      <div class="product-price">€${prod.price.toFixed(2)}</div>
      <div class="product-actions">
        <button class="add-btn" data-id="${prod.id}">Add to cart</button>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      addToCart(id);
    });
  });
}

function loadCartFromStorage() {
  const stored = localStorage.getItem("pawsome_cart");
  if (stored) {
    cart = JSON.parse(stored);
  }
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("pawsome_cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart();
  updateCartCount();
  renderCartItems();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCartItems();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalSpan.textContent = "0.00";
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <span><strong>${item.name}</strong></span>
        <span>× ${item.qty}</span>
      </div>
      <div>
        <span>€${lineTotal.toFixed(2)}</span>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    container.appendChild(row);
  });

  totalSpan.textContent = total.toFixed(2);

  container.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      removeFromCart(id);
    });
  });
}

function attachCartEvents() {
  const cartBtn = document.getElementById("cart-btn");
  const closeBtn = document.getElementById("close-cart");
  const backdrop = document.getElementById("cart-backdrop");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartBtn.addEventListener("click", () => {
    renderCartItems();
    openCart();
  });

  closeBtn.addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Thank you for your order! (Demo only – no real payment 🙂)");
    cart = [];
    saveCart();
    renderCartItems();
    updateCartCount();
  });
}

function openCart() {
  document.getElementById("cart-modal").classList.remove("hidden");
  document.getElementById("cart-backdrop").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
  document.getElementById("cart-backdrop").classList.add("hidden");
}
