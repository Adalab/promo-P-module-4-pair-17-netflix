// Importamos las librerías que necesitamos

const express = require("express");
const cors = require("cors");
// const movies = require("./movies.json");
const users = require("./users.json");
const Database = require("better-sqlite3");

//Todo el código que trae el servidor (express) nos lo traemos a la variable server.
const server = express();
// Habilitamos el servidor para que reciba Fetch de cualquier direccón (cors)
server.use(cors());
// configuramos express para que las peticiones y respuestas se envíen usando json
server.use(express.json());

//renderiza una página cualquiera
server.set("view engine", "ejs");

// Arrancamos el puerto 4000
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Configura la base de datos en Node JS

const db = Database("./src/data/database.db", { verbose: console.log });

//sacar los datos de la base de datos

// así atiende peticiones (endpoint)

server.get("/movies", (req, res) => {
  //constante que guarda el query de filtrado
  const query = db.prepare(`SELECT * FROM movies`);
  const movies = query.all();
  const genderFilterParam = req.query.gender ? req.query.gender : "";

  res.json({
    success: true,
    movies: movies.filter((movie) => movie.gender.includes(genderFilterParam)),
  });
});

// endpoint que busca a la usuaria con los datos introduccidos.

server.post("/login", (req, res) => {
  let loginUsers = users.find((user) => {
    if (user.email === req.body.email && user.password === req.body.password) {
      return user;
    }
    return null;
  });
});

// endpoint para crear motor de plantillas
server.get("/movie/:movieId", (req, res) => {
  // console.log("URL params:", req.params);
  const query = db.prepare(
    `SELECT * FROM movies WHERE id=${req.params.movieId}`
  );
  const foundMovie = query.get();
  if (foundMovie) {
    res.render("movie", foundMovie);
  }
  // const foundMovie = movies.find((movie) => movie.id === req.params.movieId);
  // console.log(foundMovie);
});

// servidor de estáticos
const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

// servidor de estáticos para las imágenes
const staticServerImage = "./src/public-movies-images";
server.use(express.static(staticServerImage));
