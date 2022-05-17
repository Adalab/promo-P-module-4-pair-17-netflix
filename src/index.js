// Importamos los dos módulos que necesitamos

const express = require('express');
const cors = require('cors');
const movies = require('./movies.json');

//Todo el código que trae el servidor (express) nos lo traemos a la variable server.
const server = express();
// Habilitamos el servidor para que reciba Fetch de cualquier direccón (cors)
server.use(cors());
// configuramos express para que las peticiones y respuestas se envíen usando json
server.use(express.json());

// Arrancamos el puerto 4000
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// así atiende peticiones (endpoint)

server.get('/movies', (req, res) => {
  //constante que guarda el query de filtrado
  const genderFilterParam = req.query.gender ? req.query.gender : '';

  res.json({
    success: true,
    movies: movies.filter((movie) => movie.gender.includes(genderFilterParam)),
  });
});

server.post('/login', (req, res) => {
  const 
});

const staticServerPathWeb = './src/public-react';
server.use(express.static(staticServerPathWeb));
const staticServerImage = './src/public-movies-images';
server.use(express.static(staticServerImage));
