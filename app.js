const request = require("request");
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/search", function (req, res) {
  const options = {
    uri: process.env.HOST,
    qs: {
      query: req.query.query,
      display: 20,
    },
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
    },
  };

  request.get(options, (err, httpResponse, body) => {
    if (!err && httpResponse.statusCode == 200) {
      console.log(httpResponse.body);
      res.send(httpResponse.body);
    } else {
      console.log(err);
      console.log(httpResponse.statusCode);
      res.send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
