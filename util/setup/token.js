var request = require("request");
var { getSessionId } = require("./session");
var { BASE_HEADER } = require("./server");

module.exports = {
  REQUEST_TOKEN: "",
  EXPIRES_AT: "",
  getRequestToken: function () {
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
        getSessionId(REQUEST_TOKEN);
      } else {
        console.log(err);
        console.log(httpResponse.statusCode);
        res.send(err);
      }
    });
  },
};
