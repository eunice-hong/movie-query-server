require("dotenv").config();

var express = require("express");
var { getRequestToken } = require("./util/setup/token");
var { PORT } = require("./util/setup/server");
var { search } = require("./routes/movie/search");

const app = express();
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {});
app.get("/search", search);

app.listen(PORT, () => {
  getRequestToken();
  console.log(`Example app listening at ${PORT}`);
});
