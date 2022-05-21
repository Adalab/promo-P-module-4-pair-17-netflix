// Importamos las librerías que necesitamos

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const movies = require("./movies.json");
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

server.get("/movies", (req, res) => {
  const query = db.prepare(`SELECT * FROM movies`);
  const movies = query.all();
  const genderFilterParam = req.query.gender ? req.query.gender : "";

  res.json({
    success: true,
    movies: movies.filter((movie) => movie.gender.includes(genderFilterParam)),
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

// endpoint que busca a la usuaria con los datos introduccidos.

server.post("/login", (req, res) => {
  const query = db.prepare(`SELECT  *
    FROM users
    WHERE email = ? AND password = ?`);
  const userLogin = query.get(req.body.email, req.body.password);
  if (userLogin !== undefined) {
    res.json({
      success: true,
      userId: userLogin.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada",
    });
  }
});
// let loginUsers = users.find((user) => {
//   if (user.email === req.body.email && user.password === req.body.password) {
//     return loginUsers;
//   }
//   return null;
// });

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

// 5.actualiza el perfil de la usuaria en el back

server.post("/user/profile", (req, res) => {
  const query = db.prepare(
    `UPDATE user SET
      email = ? password = ? WHERE id = ?`
  );
  const result = query.run(req.body.email, req.body.password, req.body.id);
  res.json({ success: true });
});

//  configuración de servidor de estáticos
const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

// servidor de estáticos para las imágenes
const staticServerImage = "./src/public-movies-images";
server.use(express.static(staticServerImage));

//servidor de estáticos para los estilos

const pathServerPublicStyles = "./src/public-css";
server.use(express.static(pathServerPublicStyles));
