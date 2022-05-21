// Importamos las librerías que necesitamos

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
// const movies = require("./movies.json");
const users = require("./users.json");

//Todo el código que trae el servidor lo guardamos en la variable server.
const server = express();

// Configuración de Express Js para Apis:
// Nuestro servidor de Espress va a tener en cuenta que pueden venir          peticiones de otro sitio y todas las peticiones van a ser em formato json
server.use(cors());
server.use(express.json());

// Configuración de Express para dinámicos
server.set("view engine", "ejs");

// Configura la base de datos SQLITE

const db = Database("./src/data/database.db", { verbose: console.log });

// Arrancar el servidor
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// ENDPOINTS

// Obtengo todas las películas

server.get("/movies", (req, res) => {
  const query = db.prepare(`SELECT * FROM movies`);
  const allMovies = query.all();
  const genderFilterParam = req.query.gender ? req.query.gender : "";

  res.json({
    success: true,
    movies: allMovies.filter((movie) =>
      movie.gender.includes(genderFilterParam)
    ),
  });
});

// Motor de plantillas
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

// Endpoint que nos permite hacer login en la web.

server.post("/login", (req, res) => {
  const query = db.prepare(`SELECT  *
    FROM users
    WHERE email = ? AND password = ?`);
  const userFound = query.get(req.body.email, req.body.password);

  //  Busco con un find, en el array de usuarias que has importado, la usuaria que tenga el mismo email y contraseña que estás recibiendo por body params

  // let loginUsers = users.find((user) => {
  //   if (user.email === req.body.email && user.password === req.body.password) {
  //     return loginUsers;
  //   }
  //   return null;
  // });

  if (userFound !== undefined) {
    res.json({
      success: true,
      userId: userFound.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada",
    });
  }
});

// registro de nuevas usuarias en el back

server.post("/signup", (req, res) => {
  const query = db.prepare(`SELECT  *
    FROM users
    WHERE email = ?`);
  const userSignUp = query.get(req.body.email);
  if (userSignUp === undefined) {
    const query = db.prepare(
      `INSERT INTO users (email, password) VALUE (?, ?)`
    );
    const userInsert = query.run(email, password);
    res.json({
      success: true,
      userId: userInsert.lastInsertRowid,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria ya existente",
    });
  }
});
// let signupUsers = users.find((user) => {
//   if (user.email === req.body.email) {
//     return signupUser;
//   }
//   return null;
// });

//  configuración de servidor de estáticos
const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

// servidor de estáticos para las imágenes
const staticServerImage = "./src/public-movies-images";
server.use(express.static(staticServerImage));
