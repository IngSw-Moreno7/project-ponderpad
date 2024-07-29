require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user");
const Note = require("./models/note");

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

// Endpoint=> Ruta principal
app.get("/", (req, res) => {
  res.json({ data: "Bienvenidos" });
});

// Crear una nueva cuenta
app.post("/create-account", async (req, res) => {
  
  // Extraer los campos necesarios del body de la solicitud
  const { name, email, password } = req.body;

  // Validaciones de los campos
  // Si el nombre no está presente, retornar un error 400 con un mensaje
  if (!name) {
    return res
      .status(400)
      .json({ error: true, message: 'El nombre es requerido.' });
  }

  // Si el correo electrónico no está presente, retornar un error 400 con un mensaje
  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: 'El correo electrónico es requerido.' });
  }

  // Si la contraseña no está presente, retornar un error 400 con un mensaje
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'La contraseña es requerida.' });
  }
  
  // Verificar si el usuario ya existe en la base de datos
  const isUser = await User.findOne({ email: email });

  // Si el usuario ya existe, retornar un mensaje de error
  if (isUser) {
    return res.json({
      error: true,
      message: 'El usuario ya existe.',
    });
  }

  // Crear un nuevo usuario con los datos proporcionados
  const user = new User({
    name,
    email,
    password,
  });

  // Guardar el nuevo usuario en la base de datos
  await user.save();

  // Crear un token de acceso para el nuevo usuario

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '36000m',
  });

  // Retornar una respuesta exitosa con el nuevo usuario y el token de acceso
  return res.json({
    error: false,
    user,
    accessToken,
    message: 'El registro fue éxitoso',
  });
});

// Acceso a la cuenta
app.post("/login", async (req, res) => {
  
  // Extrae el correo electrónico y la contraseña del body de la solicitud
  const { email, password } = req.body;

  // Verifica si el correo electrónico está presente en la solicitud
  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: 'El correo electrónico es requerido.' });
  }

  // Verifica si la contraseña está presente en la solicitud
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'La contraseña es requerida.' });
  }

  // Busca al usuario en la base de datos por el correo electrónico
  const userInfo = await User.findOne({ email: email });

  // Si no se encuentra el usuario, responde con un error
  if (!userInfo) {
    return res
      .status(400)
      .json({ error: true, message: 'El usuario no existe.' });
  }

  // Verifica si las credenciales proporcionadas coinciden con las almacenadas
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '36000m',
    });

    // Responde con un mensaje de éxito, el correo electrónico y el token de acceso
    return res.json({
      error: false,
      message: 'Inicie sesión correctamente',
      email,
      accessToken,
    });

  // Si las credenciales no son válidas, responde con un error
  } else {
    return res.status(400).json({
      error: true,
      message: 'Las credenciales no son válidas',
    });
  }
});

// Obtener usuario
app.get("/get-user", authenticateToken,  async (req, res) => {

    // Extraer el usuario del objeto de solicitud autenticado
    const { user } = req.user;
    
    // Buscar el usuario en la base de datos por su ID
    const isUser = await User.findOne({ _id: user._id });
    
    // Si el usuario no existe, devolver un estado 401 (No autorizado)
    if (!isUser) {
      return res.sendStatus(401);
    }
    
    // Si el usuario existe, devolver el usuario y un mensaje vacío
    return res.json({
      user: {
        name: isUser.name, 
        email: isUser.email, 
        _id: isUser.id, 
        createdOn: isUser.createdOn, 
      },
      message: "Usuario encontrado con éxito",
    });
});

// Agregar una nota
app.post("/add-note", authenticateToken, async (req, res) => {
  
  // Extraer título, contenido y etiquetas del cuerpo de la solicitud
  const { title, content, tags } = req.body;
  
  // Extraer el usuario autenticado de la solicitud
  const { user } = req.user;

  // Verificar si el título está presente
  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: 'El título es obligatorio.' });
  }

  // Verificar si el contenido está presente
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: 'El contenido es obligatorio.' });
  }

  try {
    // Crear una nueva nota
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    // Guardar la nota en la base de datos
    await note.save();

    // Responder con éxito y devolver la nota creada
    return res.json({
      error: false,
      note,
      message: 'Nota agregada exitosamente.',
    });
  } catch (error) {
    // Manejar errores internos del servidor
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor.',
    });
  }
});

// Editar una nota
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  
  // Obtiene el ID de la nota desde los parámetros de la URL
  const noteId = req.params.noteId;

  // Extrae el título, contenido, etiquetas y si está fijada de la solicitud del cuerpo
  const { title, content, tags, isPinned } = req.body;
  
  // Extrae el usuario autenticado de la solicitud
  const { user } = req.user;

  // Verifica si no se proporcionaron cambios en la solicitud
  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: 'No hay cambios proporcionados' });
  }

  try {
    // Busca la nota por ID y el ID del usuario
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    
    // Si la nota no se encuentra, responde con un error 404
    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: 'Nota no encontrada' });
    }
    // Actualiza los campos de la nota si se proporcionaron en la solicitud
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    // Guarda los cambios en la base de datos
    await note.save();

    // Responde con la nota actualizada
    return res.json({
      error: false,
      note,
      message: 'Nota actualizada',
    });
  } catch (error) {
    // Maneja errores y responde con un error 500 si ocurre un problema en el servidor
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor.',
    });
  }
});

// Obtener todas las notas 
app.get("/get-all-notes", authenticateToken, async (req, res) => {

  // Obtener el usuario autenticado desde el token
  const { user } = req.user;

  try {
    // Buscar todas las notas del usuario en la base de datos y ordenarlas
    // Las notas fijadas (isPinned) se mostrarán primero
    const notes = await Note.find({userId: user._id}).sort({ isPinned: -1 });
  
    // Responder con las notas encontradas y un mensaje de éxito
    return res.json({
      error: false,
      notes,
      message: "Todas las notas recuperadas con éxito",
    });

  } catch (error) {
    // En caso de error, responder con un mensaje de error interno del servidor
    return res.status(500).json ({
      error: true, 
      message: "Error interno del servidor.Error interno del servidor.",
    });
  }
});

/// Eliminar las notas 
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {

  const noteId = req.params.noteId;
  const { user } = req.user;

  try {

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    
    if (!note) {
      return res.status(404).json({ error: true, message: "Nota no encontrada" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });
    
    return res.json({
      error: false,
      message: "Nota eliminada exitosamente",
    })

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Error interno del servidor.",
    })
    
  }
});

/// Actualizar  ispinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {

  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: 'Nota no encontrada' });
    }
    
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Nota actualizada',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor.Error interno del servidor.',
    });
  }
});

// El puerto donde corre la aplicación
app.listen(3907);

module.exports = app;
