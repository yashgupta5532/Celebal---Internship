const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // To parse JSON request bodies

// In-memory user data
let users = [
  { id: 1, name: "Rupesh", email: "rupesh@example.com" },
  { id: 2, name: "Yash", email: "yash@gmail.com" },
];

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Express.js!",
  });
});

// ✅ GET all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// ✅ GET a single user by ID
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found.");
  res.json(user);
});

// ✅ POST (Create) a new user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// ✅ PUT (Update) an existing user
app.put("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found.");

  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  res.json(user);
});

// ✅ DELETE a user
app.delete("/api/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.send("User deleted successfully.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
