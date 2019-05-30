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
    .catch((err) => {
      console.log(err)
      res.send("500")
    })
})

//post example: curl -d "id=69&title="test"&description="a"&community="a"&tags="ghsj"" -X POST localhost:8080/submit
app.post("/submit", (req, res) => {
  console.log("Submission receieved for", req.body.id, req.body.title, req.body.description, req.body.community, req.body.tags)
  db.any("INSERT INTO notice (id, title, description, community, tags) VALUES (" +
      req.body.id + ", \'" + req.body.title + "\', \'" + req.body.description + "\', \'" + req.body.community + "\', \'" + req.body.tags + "\')")
    .then(function (data) {
      res.send("200")
    })
    .catch((err) => {
      console.log(err)
      res.send("500")
    })
})

app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'))
})
