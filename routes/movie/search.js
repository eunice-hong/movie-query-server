var request = require("request");
var { ref, set } = require("firebase/database");
var { FIREBASE_DATABASE } = require("../../util/setup/firebase");
var { BASE_HEADER } = require("../../util/setup/server");

module.exports = {
  search: function (req, res) {
    const options = {
      headers: BASE_HEADER,
      uri: process.env.HOST + "/search/movie",
      qs: {
        query: req.query.query,
        api_key: process.env.THE_MOVIE_DB_API_KEY,
        language: "ko-KR",
        page: req.query.page,
        include_adult: false,
      },
    };

    request.get(options, (err, httpResponse, body) => {
      if (!err && httpResponse.statusCode == 200) {
        const movieList = JSON.parse(httpResponse.body)["results"];
        writeMovieData(movieList);
        res.send(httpResponse.body);
      } else {
        console.log(httpResponse.statusCode);
        res.send(err);
      }
    });
  },
};

async function writeMovieData(movieList) {
  movieList.forEach((movie) => {
    let genreIds;
    if (movie.genre_ids != undefined && movie.genre_ids.size != 0) {
      const idMap = {};
      movie.genre_ids?.map((element) => {
        idMap[element.toString()] = true;
      });
      genreIds = idMap;
    } else {
      genreIds = {};
    }

    const movieData = {
      title: movie.title,
      adult: movie.adult,
      genre_ids: genreIds,
      id: movie.id,
      original_language: movie.original_language,
      original_title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      video: movie.video,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
    };

    if (movie.backdrop_path != undefined) {
      movieData["backdrop_path"] = movie.backdrop_path;
    }
    if (movie.poster_path != undefined) {
      movieData["poster_path"] = movie.poster_path;
    }
    if (movie.release_date != undefined) {
      movieData["release_date"] = movie.release_date;
    }

    set(ref(FIREBASE_DATABASE, "movies/" + movie.id), movieData);
  });
}
