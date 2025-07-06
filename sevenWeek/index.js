const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;
const SECRET_KEY = "secret_key"; 

app.use(express.json());

// In-memory user data
let users = [
  { id: 1, name: "Rupesh", email: "rupesh@example.com", password: bcrypt.hashSync("rupesh123", 8) },
  { id: 2, name: "Yash", email: "yash@gmail.com", password: bcrypt.hashSync("yash123", 8) },
];

// ✅ Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Format: Bearer <token>
  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized." });
    req.userId = decoded.id;
    next();
  });
}

// ✅ Default route
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express.js with JWT!" });
});

// ✅ Login route - issues JWT
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found." });

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) return res.status(401).json({ message: "Invalid password." });

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// ✅ GET all users (protected)
app.get("/api/users", verifyToken, (req, res) => {
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email }))); // hide password
});

// ✅ GET a single user by ID (protected)
app.get("/api/users/:id", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found.");
  const { password, ...rest } = user;
  res.json(rest);
});

// ✅ POST (Create) a new user
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 8),
  };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

// ✅ PUT (Update) an existing user (protected)
app.put("/api/users/:id", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found.");

  const { name, email, password } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  if (password) user.password = bcrypt.hashSync(password, 8);

  res.json({ id: user.id, name: user.name, email: user.email });
});

// ✅ DELETE a user (protected)
app.delete("/api/users/:id", verifyToken, (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.send("User deleted successfully.");
});

// ✅ Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: `This is a protected route for user ID ${req.userId}` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
