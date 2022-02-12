var request = require("request");
var { ref, set } = require("firebase/database");
var { FIREBASE_DATABASE } = require("../../util/setup/firebase");
var { BASE_HEADER } = require("../../util/setup/server");
const { async } = require("@firebase/util");

module.exports = {
  movieDetail: function (req, res) {
    const options = {
      headers: BASE_HEADER,
      uri: process.env.HOST + "/movie/" + req.params.id,
      qs: {
        api_key: process.env.THE_MOVIE_DB_API_KEY,
        language: "ko-KR",
      },
    };

    request.get(options, (err, httpResponse, body) => {
      if (!err && httpResponse.statusCode == 200) {
        const movie = JSON.parse(httpResponse.body);
        getKeywords(res, movie);
        console.log("set movie " + movie.id + " on fb ");
      } else {
        console.log(httpResponse.statusCode);
        res.send(err);
      }
    });
  },
};

async function getKeywords(res, movie) {
  const options = {
    headers: BASE_HEADER,
    uri: process.env.HOST + "/movie/" + movie.id + "/keywords",
    qs: {
      api_key: process.env.THE_MOVIE_DB_API_KEY,
      language: "ko-KR",
    },
  };

  request.get(options, (err, httpResponse, body) => {
    if (!err && httpResponse.statusCode == 200) {
      const responseBody = JSON.parse(httpResponse.body);
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
        budget: movie.budget,
        genres: movie.genres,
        homepage: movie.homepage,
        imdb_id: movie.imdb_id,
        production_companies: movie.production_companies,
        production_countries: movie.production_countries,
        revenue: movie.revenue,
        runtime: movie.runtime,
        spoken_languages: movie.spoken_languages,
        status: movie.status,
        tagline: movie.tagline,
        keywords: responseBody.keywords,
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
      res.send(movieData);
      console.log("set movie detail of " + movie.id + " on fb ");
    } else {
      console.log(httpResponse.statusCode);
      res.send(err);
    }
  });
}
