const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

//el path del ejercicio inicial con metodo get
app.get('/', (req, res) => {
  res.json({ data: "Bienvenidos" });
});

// Este es el puerto donde corre la aplicación
app.listen(3907);

module.exports = app;
