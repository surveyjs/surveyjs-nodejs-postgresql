var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var PostgresSurveyStorage = require("./db-adapters/postgres");
var apiBaseAddress = "/api";

var app = express();
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getStorage(req) {
  var storage = new PostgresSurveyStorage(req.session);
  return storage;
}

function sendJsonResult(res, obj) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(obj));
}

app.get(apiBaseAddress + "/getActive", function (req, res) {
  var storage = getStorage(req);
  storage.getSurveys(function (result) {
    sendJsonResult(res, result);
  });
});

app.get(apiBaseAddress + "/getSurvey", function (req, res) {
  var storage = getStorage(req);
  var surveyId = req.query["surveyId"];
  storage.getSurvey(surveyId, function (result) {
    sendJsonResult(res, result);
  });
});

app.get(apiBaseAddress + "/changeName", function (req, res) {
  var storage = getStorage(req);
  var id = req.query["id"];
  var name = req.query["name"];
  storage.changeName(id, name, function (result) {
    sendJsonResult(res, result);
  });
});

app.get(apiBaseAddress + "/create", function (req, res) {
  var storage = getStorage(req);
  var name = req.query["name"];
  storage.addSurvey(name, function (survey) {
    sendJsonResult(res, survey);
  });
});

app.post(apiBaseAddress + "/changeJson", function (req, res) {
  var storage = getStorage(req);
  var id = req.body.id;
  var json = req.body.json;
  storage.storeSurvey(id, null, json, function (survey) {
    sendJsonResult(res, survey);
  });
});

app.post(apiBaseAddress + "/post", function (req, res) {
  var storage = getStorage(req);
  var postId = req.body.postId;
  var surveyResult = req.body.surveyResult;
  storage.postResults(postId, surveyResult, function (result) {
    sendJsonResult(res, result.json);
  });
});

app.get(apiBaseAddress + "/delete", function (req, res) {
  var storage = getStorage(req);
  var id = req.query["id"];
  storage.deleteSurvey(id, function (result) {
    sendJsonResult(res, { id: id });
  });
});

app.get(apiBaseAddress + "/results", function (req, res) {
  var storage = getStorage(req);
  var postId = req.query["postId"];
  storage.getResults(postId, function (result) {
    sendJsonResult(res, result);
  });
});

app.get(["/", "/about", "/run/*", "/edit/*", "/results/*"], function (req, res, next) {
  res.sendFile("index.html", { root: __dirname + "/../public" });
});

app.use(express.static(__dirname + "/../public"));

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Listening on port: " + port + "...");
});
