const express = require("express");
const cors = require("cors");

// Habilitamos el servidor para que reciba el Fetch de cualquier dirección
const server = express();
server.use(cors());
server.use(express.json());

// Arrancamos el puerto 4000
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get("/api/movies", (req, res) => {
  const response = {
    success: true,
    movies: [
      {
        id: "1",
        title: "Gambita de dama",
        gender: "Drama",
        image: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        title: "Friends",
        gender: "Comedia",
        image: "https://via.placeholder.com/150",
      },
    ],
  };
});
