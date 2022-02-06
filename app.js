const request = require("request");
const express = require("express");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

var REQUEST_TOKEN = "";
var EXPIRES_AT = "";
var SESSION_ID = "";

const BASE_HEADER = {
  Authorization: "Bearer " + process.env.THE_MOVIE_DB_API_TOKEN,
  "Content-Type": "application/json;charset=utf-8",
};

const firebaseConfig = {
  apiKey: process.env.FIREBASE_WEB_API_KEY,
  authDomain: process.env.FIREBASE_WEB_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_WEB_DATABASE_URL,
  projectId: process.env.FIREBASE_WEB_PROJECT_ID,
  storageBucket: process.env.FIREBASE_WEB_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_WEB_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_WEB_APP_ID,
  measurementId: process.env.FIREBASE_WEB_MEASUREMENT_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

app.use(cors());

app.get("/", (req, res) => {});

app.get("/search", function (req, res) {
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
});

app.get("/genre", function (req, res) {
  const options = {
    headers: BASE_HEADER,
    uri: process.env.HOST + "/genre/movie/list",
    qs: {
      api_key: process.env.THE_MOVIE_DB_API_KEY,
      language: "ko-KR",
    },
  };

  request.get(options, (err, httpResponse, body) => {
    if (!err && httpResponse.statusCode == 200) {
      res.send(httpResponse.body);
    } else {
      console.log(httpResponse.statusCode);
      res.send(err);
    }
  });
});

function main() {
  getRequestToken();
}

function getRequestToken() {
  const options = {
    headers: BASE_HEADER,
    uri: process.env.HOST + "/authentication/token/new",
    qs: {
      api_key: process.env.THE_MOVIE_DB_API_KEY,
    },
  };

  request.get(options, (err, httpResponse, body) => {
    if (!err && httpResponse.statusCode == 200) {
      REQUEST_TOKEN = httpResponse.body.request_token;
      EXPIRES_AT = httpResponse.body.expires_at;
      getSessionId();
    } else {
      console.log(err);
      console.log(httpResponse.statusCode);
      res.send(err);
    }
  });
}

function getSessionId() {
  const options = {
    headers: BASE_HEADER,
    uri: process.env.HOST + "/authentication/guest_session/new",
    qs: {
      api_key: process.env.THE_MOVIE_DB_API_KEY,
    },
  };
  const body = {
    request_token: REQUEST_TOKEN,
  };

  request.post(options, (err, httpResponse, body) => {
    if (!err && httpResponse.statusCode == 200) {
      SESSION_ID = httpResponse.body.guest_session;
    } else {
      console.log(err);
      console.log(httpResponse.statusCode);
      res.send(err);
    }
  });
}
// String title;
// bool adult; //: false,
// String? backdropPath; //: "/wESuRMxELPAwo56qFRcoyI4p20F.jpg",
// List<dynamic> genreIds; //: ,
// int id; //: 254302,
// String originalLanguage; //: "en",
// String originalTitle; //: "High-Rise",
// String overview; //: "1975년 런던, 세계적인 건축가 안토니...",
// double popularity; //: 16.548,
// String? posterPath; //: "/mEc5KbzVbOPDyZeWt9k0kWwyNnc.jpg",
// String? releaseDate; //: "2015-11-22",
// bool video; //: false,
// double voteAverage; //: 5.7,
// int voteCount; //: 934

async function writeMovieData(movieList) {
  const db = getDatabase();
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

    set(ref(db, "movies/" + movie.id), movieData);
  });
}

app.listen(port, () => {
  main();
  console.log(`Example app listening at ${port}`);
});
