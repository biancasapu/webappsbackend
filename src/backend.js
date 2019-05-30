'use strict';
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

const db = pgp(process.env.DATABASE);

app.get("/", (req, res) => {
  console.log("Backend running on port " + app.get('port'))
  res.send({PORT : app.get('port')})
}
)

app.get("/hello/:arg", (req, res) => {
  console.log("Request Started")
  db.any('SELECT ' + req.params.arg + ' FROM notice')
    .then(function (data) {
      res.send({
        DATA: data
      })
    })
})

app.post("/submit", (req, res) => {
  console.log("Submission recieved for $1 $2 $3 $4", req.body.id, req.body.title, req.body.description, req.body.location)
  db.any("INSERT INTO notice (id, title, description, location) VALUES (" +
      req.body.id + ", " + req.body.title + ", " + req.body.description + ", " + req.body.location + ")")
    .then(function (data) {
      res.send({
        DATA: data
      })
    })
})

require('greenlock-express').create({
   // Let's Encrypt v2 is ACME draft 11
   version: 'draft-11',

   // Note: If at first you don't succeed, switch to staging to debug
   // https://acme-staging-v02.api.letsencrypt.org/directory
   server: 'https://acme-v02.api.letsencrypt.org/directory',

   // Where the certs will be saved, MUST have write access
   configDir: './secure/',

   // You MUST change this to a valid email address
   email: 'bc3717@imperial.ac.uk',

   // You MUST change these to valid domains
   // NOTE: all domains will validated and listed on the certificate
   approveDomains: ['webapps05backend.herokuapp.com'],

   // You MUST NOT build clients that accept the ToS without asking the user
   agreeTos: true,

   app: app,

   // Join the community to get notified of important updates
   communityMember: false,

   // Contribute telemetry data to the project
   telemetry: false

   //, debug: true
}).listen(80, 443);
