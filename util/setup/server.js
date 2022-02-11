module.exports = {
  PORT: process.env.PORT || 3000,
  BASE_HEADER: {
    Authorization: "Bearer " + process.env.THE_MOVIE_DB_API_TOKEN,
    "Content-Type": "application/json;charset=utf-8",
  },
};
