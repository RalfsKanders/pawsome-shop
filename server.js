const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "db.json");

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const init = {
      users: [
        { id: "admin1", email: "admin@shop.local", password: "admin123", role: "admin" }
      ],
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const products = [
  {
    id: "p1",
    name: "Squeaky Bone Toy",
    description: "Durable rubber chew bone.",
    price: 7.99,
    imageUrl: "https://petfactory.com/wp-content/uploads/2020/09/Logical-Pet_-Rubber-Squeaky-Bone_12020.jpg"
  },
  {
    id: "p2",
    name: "Rope Tug Toy",
    description: "Strong cotton rope for tug games.",
    price: 9.5,
    imageUrl: "https://www.petscorner.co.uk/Images/Product/Default/xlarge/great-small-rope-knot-ball-tug-46cm-1.jpg"
  },
  {
    id: "p3",
    name: "Puzzle Treat Ball",
    description: "Interactive ball that dispenses treats.",
    price: 14.25,
    imageUrl: "https://www.durapawbox.com/cdn/shop/products/DurableRubberDogToyTreatDispenserCanada_grande.jpg?v=1734886701"
  },
  {
    id: "p4",
    name: "Plush Duck Toy",
    description: "Soft plush duck for gentle chewers.",
    price: 8.75,
    imageUrl: "https://i5.walmartimages.com/asr/51c99f5a-28a8-412c-b802-963bd41c6e01.b836fc339d457fe79e1f15bdb9df2bbf.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"
  }
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const db = loadDb();
  const user = db.users.find(u => u.id === token);

  if (!user) return res.status(401).json({ message: "Invalid token" });

  req.user = user;
  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admins only" });
  next();
}

app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  const db = loadDb();

  if (db.users.find(u => u.email === email))
    return res.status(400).json({ message: "Email already exists" });

  const user = {
    id: uuid(),
    email,
    password,
    role: "customer"
  };

  db.users.push(user);
  saveDb(db);

  res.json({ token: user.id, user });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = loadDb();

  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid login" });

  res.json({ token: user.id, user });
});

app.post("/api/orders", authRequired, (req, res) => {
  const { items, total } = req.body;
  const db = loadDb();

  const order = {
    id: uuid(),
    userId: req.user.id,
    email: req.user.email,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);
  saveDb(db);

  res.status(201).json(order);
});

app.get("/api/orders/my", authRequired, (req, res) => {
  const db = loadDb();
  const userOrders = db.orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

app.get("/api/orders", authRequired, adminOnly, (req, res) => {
  const db = loadDb();
  res.json(db.orders);
});

app.patch("/api/orders/:id/status", authRequired, adminOnly, (req, res) => {
  const { status } = req.body;
  const valid = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!valid.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const db = loadDb();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  saveDb(db);

  res.json(order);
});

app.listen(PORT, () => console.log(`Backend running → http://localhost:${PORT}`));
