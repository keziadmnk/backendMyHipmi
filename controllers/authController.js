const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pengurus } = require("../models/PengurusModel");

const JWT_SECRET_KEY = "your-secret-key";

const login = async (req, res) => {
  const { email_pengurus, password } = req.body;

  try {
    const pengguna = await Pengurus.findOne({
      where: { email_pengurus },
    });

    if (!pengguna) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, pengguna.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id_pengurus: pengguna.id_pengurus, email: pengguna.email_pengurus },
      JWT_SECRET_KEY,
      { expiresIn: "1h" } 
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id_pengurus: pengguna.id_pengurus,
        nama_pengurus: pengguna.nama_pengurus,
        email_pengurus: pengguna.email_pengurus,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

module.exports = { login };
