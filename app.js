import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//==============================================================================
// Index.html
app.use(express.static(path.join(__dirname, 'public')));

// Route default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//==============================================================================
// Data In-Memory
const users = [
  { id: 1, name: "Deni",  email: "deni@example.com", role: "buyer" },
  { id: 2, name: "Jihan", email: "Jihan@example.com", role: "seller" },
  { id: 3, name: "Eko", email: "eko@example.com", role: "buyer" },
  { id: 4, name: "Dwi", email: "dwi@example.com", role: "seller" },
  { id: 5, name: "Karno", email: "karno@example.com", role: "buyer" }
];

//=============================================================================


const ALLOWED_ROLES = ["buyer", "seller"];

// ====== USERS: GET /users (list semua user) ======
app.get("/users", (req, res) => {
  res.status(200).json({ data: users });
});

// ====== USERS: GET /users/:id (detail user) ======
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }
  res.status(200).json(user);
});

// ====== USERS: POST /users (buat user baru) ======
app.post("/users", (req, res) => {
  const { name, email, role } = req.body;

  // validasi wajib
  if (!name || !email || !role) {
    return res.status(400).json({ error: "name, email, dan role wajib diisi" });
  }
  // validasi role
  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: "role harus 'buyer' atau 'seller'" });
  }
  // cek email duplikat
  const exists = users.some(u => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "email sudah terdaftar" });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    role
  };
  users.push(newUser);

  return res.status(201).json({
    message: "User berhasil dibuat",
    data: newUser
  });
});

// PUT /users/:id → ganti semua data lama (harus lengkap)
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex(u => u.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }

  const { name, email, role } = req.body;

  // semua wajib diisi
  if (!name || !email || !role) {
    return res.status(400).json({
      error: "Semua field (name, email, role) wajib diisi untuk PUT"
    });
  }

  // validasi role
  if (!["buyer", "seller"].includes(role)) {
    return res.status(400).json({ error: "role harus 'buyer' atau 'seller'" });
  }

  // validasi email duplikat (kecuali user ini sendiri)
  const duplicate = users.some(u => u.email === email && u.id !== id);
  if (duplicate) {
    return res.status(409).json({ error: "email sudah terdaftar" });
  }

  // GANTI SELURUHNYA (tidak mempertahankan data lama)
  users[idx] = { id, name, email, role };

  return res.status(200).json({
    message: "User berhasil diganti sepenuhnya (PUT)",
    data: users[idx]
  });
});

// ====== USERS: PATCH /users/:id (ubah sebagian data) ======
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }

  const { name, email, role } = req.body;

  // validasi role (jika dikirim)
  if (role !== undefined && !ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: "role harus 'buyer' atau 'seller'" });
  }

  // validasi email duplikat (jika dikirim)
  if (email !== undefined) {
    const duplicate = users.some(u => u.email === email && u.id !== id);
    if (duplicate) {
      return res.status(409).json({ error: "email sudah terdaftar" });
    }
  }

  if (name  !== undefined) user.name  = name;
  if (email !== undefined) user.email = email;
  if (role  !== undefined) user.role  = role;

  return res.status(200).json({
    message: "Data user berhasil diubah sebagian",
    data: user
  });
});

// ====== USERS: DELETE /users/:id (hapus user) ======
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }
  const removed = users.splice(idx, 1)[0];
  return res.status(200).json({
    message: "User berhasil dihapus",
    data: removed
  });
});

// ====== Fallback 404 untuk path yang tidak ada ======
app.use((req, res) => {
  res.status(404).json({ error: "Path tidak ditemukan" });
});

// ====== Jalankan server ======
app.listen(3000, () => {
  console.log("✅ Server berjalan di http://localhost:3000");
});