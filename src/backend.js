const express = require('express')
var bodyparser = require('body-parser')
var cors = require('cors')
const app = express()

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))

app.set('port', process.env.PORT || 8080)


// DATABASE
var pgp = require('pg-promise')();

const db = pgp(process.env.DATABASE_URL);

app.get("/", (req, res) => {
  console.log("Backend running on port " + app.get('port'))
  res.send({PORT : app.get('port')})
}
)

app.get("/notice/:column", (req, res) => {
  console.log("Request Started")
  db.any('SELECT ' + req.params.column + ' FROM notice')
    .then(function (data) {
      res.send({
        DATA: data
      })
    })
})

app.post("/submit", (req, res) => {
  console.log("Submission receieved for $1 $2 $3 $4 $5", req.body.id, req.body.title, req.body.description, req.body.location, req.body.tags)
  db.any("INSERT INTO notice (id, title, description, location, tags) VALUES (" +
      req.body.id + ", " + req.body.title + ", " + req.body.description + ", " + req.body.location + ", " + req.body.tags + ")")
    .then(function (data) {
      res.send({
        DATA: data
      })
    })
})

app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'))
})
