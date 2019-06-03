const express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
const app = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);

app.set("port", process.env.PORT || 8080);

// DATABASE
var pgp = require("pg-promise")();

const db = pgp(process.env.DATABASE_URL);

app.get("/", (req, res) => {
  console.log("Backend running on port " + app.get("port"));
  res.send({
    PORT: app.get("port")
  });
});

app.get("/notice/:column", (req, res) => {
  console.log("Request Started");
  db.any("SELECT " + req.params.column + " FROM notice ORDER BY id DESC")
    .then(function (data) {
      res.send({
        DATA: data
      });
    })
    .catch(err => {
      console.log(err);
      res.send("500");
    });
});

app.get("/notice/max/:column", (req, res) => {
  console.log("Request Started");
  db.any(
      "SELECT " +
      req.params.column +
      " FROM notice WHERE length(" +
      req.params.column +
      ") = (SELECT max(length(" +
      req.params.column +
      ")) from notice )" +
      " ORDER BY " +
      req.params.column +
      " DESC fetch first row only"
    )
    .then(function (data) {
      res.send({
        DATA: data
      });
    })
    .catch(err => {
      console.log(err);
      res.send("500");
    });
});

//post example: curl -d "id=69&title="test"&description="a"&community="a"&tags="ghsj"" -X POST localhost:8080/submit
app.post("/submit", (req, res) => {
  console.log(
    "Submission receieved for",
    req.body.id,
    req.body.title,
    req.body.description,
    req.body.postcode,
    req.body.community,
    req.body.tags,
    req.body.contact,
    req.body.lastSeen,
    req.body.pic1,
    req.body.pic2,
    req.body.pic3
  );
  db.any(
      "INSERT INTO notice (id, title, description, postcode, community, tags, contact, lastseen, pic1, pic2, pic3) VALUES (" +
      req.body.id +
      ", '" +
      req.body.title +
      "', '" +
      req.body.description +
      "', '" +
      req.body.postcode +
      "', '" +
      req.body.community +
      "', '" +
      req.body.tags +
      "', '" +
      req.body.contact +
      "', '" +
      req.body.lastSeen +
      "', '" +
      req.body.pic1 +
      "', '" +
      req.body.pic2 +
      "', '" +
      req.body.pic3 +
      "')"
    )
    .then(function (data) {
      res.send("200");
    })
    .catch(err => {
      console.log(err);
      res.send("500");
    });
});

app.listen(app.get("port"), function () {
  console.log("Server listening on port " + app.get("port"));
});
