// login

const getMoviesFromApi = () => {
  return fetch("//localhost:4000/movies", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
