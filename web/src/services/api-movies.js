// login

const getMoviesFromApi = (value) => {
  return fetch(`//localhost:4000/movies?gender=${value.gender}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
