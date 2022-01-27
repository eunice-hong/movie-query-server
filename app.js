const request = require("request");
const express = require("express");
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

app.listen(port, () => {
  main();
  console.log(`Example app listening at ${port}`);
});
