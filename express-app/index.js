const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const PostgresSurveyStorage = require("./db-adapters/postgres");
const apiBaseAddress = "/api";

const app = express();
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getStorage (req) {
  const storage = new PostgresSurveyStorage(req.session);
  return storage;
}

function sendJsonResult (res, obj) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(obj));
}

app.get(apiBaseAddress + "/getActive", (req, res) => {
  const storage = getStorage(req);
  storage.getSurveys((result) => {
    sendJsonResult(res, result);
  });
});

app.get(apiBaseAddress + "/getSurvey", (req, res) => {
  const storage = getStorage(req);
  const surveyId = req.query["surveyId"];
  storage.getSurvey(surveyId, (result) => {
    sendJsonResult(res, result);
  });
});

app.get(apiBaseAddress + "/changeName", (req, res) => {
  const storage = getStorage(req);
  const id = req.query["id"];
  const name = req.query["name"];
  storage.changeName(id, name, (result) => {
    sendJsonResult(res, result);
  });
});

app.get(apiBaseAddress + "/create", (req, res) => {
  const storage = getStorage(req);
  const name = req.query["name"];
  storage.addSurvey(name, (survey) => {
    sendJsonResult(res, survey);
  });
});

app.post(apiBaseAddress + "/changeJson", (req, res) => {
  const storage = getStorage(req);
  const id = req.body.id;
  const json = req.body.json;
  storage.storeSurvey(id, null, json, (survey) => {
    sendJsonResult(res, survey);
  });
});

app.post(apiBaseAddress + "/post", (req, res) => {
  const storage = getStorage(req);
  const postId = req.body.postId;
  const surveyResult = req.body.surveyResult;
  storage.postResults(postId, surveyResult, (result) => {
    sendJsonResult(res, result.json);
  });
});

app.get(apiBaseAddress + "/delete", (req, res) => {
  const storage = getStorage(req);
  const id = req.query["id"];
  storage.deleteSurvey(id, () => {
    sendJsonResult(res, { id: id });
  });
});

app.get(apiBaseAddress + "/results", (req, res) => {
  const storage = getStorage(req);
  const postId = req.query["postId"];
  storage.getResults(postId, (result) => {
    sendJsonResult(res, result);
  });
});

app.get(["/", "/about", "/run/*", "/edit/*", "/results/*"], (_, res) => {
  res.sendFile("index.html", { root: __dirname + "/../public" });
});

app.use(express.static(__dirname + "/../public"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port: " + port + "...");
});
