require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ data: "Bienvenidos" });
});

// Crear una nueva cuenta
app.post("/create-account", async (req, res) => {

  const { name, email, password } = req.body;

  // Validaciones
  if (!name) {
  return res.status(400).json({ error: true, message: "El nombre es requerido." });  
  }

  if (!email) {
  return res.status(400).json({ error: true, message: "El correo electrónico es requerido." });  
  }

  if (!password) {
  return res.status(400).json({ error: true, message: "La contraseña es requerida." });  
  }

  const isUser = await User.findOne({email: email});

  if (isUser) {
    return res.json({
      error: true,
      message: "El usuario ya existe."
    })
  }

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();

  // Crear token de acceso
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "El registro fue éxitoso",

  })

});

// Acceso
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  if (!email) {
  return res.status(400).json({ error: true, message: "El correo electrónico es requerido." });  
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "La contraseña es requerida." });  
  }

  const userInfo = await User.findOne({ email: email});

  if (!userInfo) {
    return res.status(400).json({ error: true, message: "El usuario no existe." });  
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Inicie sesión correctamente",
      email, 
      accessToken,
    });

  } else {
    return res.status(400).json({
      error: true,
      message: "Las credenciales no son válidas",
    });
  }
});

// Agregar una nota
app.post("/add-note", authenticateToken, async (req, res) =>{

});

// El puerto donde corre la aplicación
app.listen(3907);

module.exports = app;
