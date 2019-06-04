const app = require("./backend");

app.listen(app.get("port"), function() {
  console.log("Server listening on port " + app.get("port"));
});