var request = require("request");
var { BASE_HEADER } = require("./server");

module.exports = {
  SESSION_ID: "",
  getSessionId: function (requestToken) {
    const options = {
      headers: BASE_HEADER,
      uri: process.env.HOST + "/authentication/guest_session/new",
      qs: {
        api_key: process.env.THE_MOVIE_DB_API_KEY,
      },
    };
    const body = {
      request_token: requestToken,
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
  },
};
