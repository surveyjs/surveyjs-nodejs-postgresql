const fs = require("fs");

const readFileSync = filename => fs.readFileSync(filename).toString("utf8");

const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_DB,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
    ? readFileSync(process.env.DATABASE_PASSWORD)
    : null
};

var currentId = 1;

const Pool = require('pg').Pool
const pool = new Pool(dbConfig);

function PostgresDBAdapter(session) {

  function getObjectsFromStorage(tableName, filter, callback) {
    filter = filter || [];
    let where = "";
    if(filter.length > 0) {
      where += " WHERE " + filter.map(fi => "" + fi.name + fi.op + fi.value).join(" AND ");
    }

    const command = "SELECT * FROM " + tableName + where;
    // console.log(command);
    pool.query(command, (error, results) => {
      if (error) {
        throw error;
      }
      callback(results.rows);
    });
  }

  function deleteObjectFromStorage(tableName, idValue, callback) {
    pool.query("DELETE FROM " + tableName + " WHERE id='" + idValue + "'", (error, results) => {
      if (error) {
        throw error;
      }
      callback(results);
    });
  }

  function createObjectInStorage(tableName, object, callback) {
    const valueNames = [];
    const valueIndexes = [];
    const values = [];
    Object.keys(object).forEach((key, index) => {
      if(object[key] !== undefined) {
        valueNames.push(key);
        valueIndexes.push("$" + (index + 1));
        values.push(object[key]);
      }
    });
    const command = "INSERT INTO " + tableName + " (" + valueNames.join(", ") + ") VALUES (" + valueIndexes.join(", ") + ") RETURNING id";
    // console.log(command);
    // console.log(values);
    pool.query(command, values, (error, results) => {
      if (error) {
        throw error;
      }
      console.log(JSON.stringify(results));
      callback(results.rows[0].id);
    });
  }

  function updateObjectInStorage(tableName, object, callback) {
    const valueNames = [];
    const values = [];
    Object.keys(object).forEach((key, index) => {
      if(object[key] !== undefined) {
        valueNames.push(key + " = $" + (index + 1));
        values.push(object[key]);
      }
    });
    const command = "UPDATE " + tableName + " SET " + valueNames.join(", ") + " WHERE id = '" + object.id  + "'";
    // console.log(command);
    // console.log(values);
    pool.query(command, values, (error, results) => {
      if (error) {
        throw error;
      }
      callback(object);
    });
  }

  function addSurvey(name, callback) {
    var newObj = {
      name: name || ("New Survey" + " " + currentId++),
      json: "{}"
    };
    createObjectInStorage("surveys", newObj, id => { 
      newObj.id = id;
      callback(newObj);
    });
  }

  function postResults(postId, json, callback) {
    var newObj = {
      postid: postId,
      json: json
    };
    console.log(JSON.stringify(newObj));
    createObjectInStorage("results", newObj, id => { 
      newObj.id = id;
      callback(newObj);
    });
  }

  return {
    addSurvey: addSurvey,
    getSurvey: function (surveyId, callback) {
      getObjectsFromStorage("surveys", [{ name: "id", op: "=", value: "'" + surveyId + "'" }], function (results) { callback(results[0]); });
    },
    storeSurvey: function (id, name, json, callback) {
      updateObjectInStorage("surveys", { id: id, json: json }, function (results) { callback(results); });
    },
    getSurveys: function (callback) {
      getObjectsFromStorage("surveys", [], function (results) { callback(results); });
    },
    deleteSurvey: function (surveyId, callback) {
      deleteObjectFromStorage("surveys", surveyId, function (results) { callback(results); });
    },
    postResults: postResults,
    getResults: function (postId, callback) {
      getObjectsFromStorage("results", [{ name: "postid", op: "=", value: "'" + postId + "'" }], function (results) { callback({ id: postId, data: results.map(r => r.json)}); });
    },
    changeName: function (id, name, callback) {
      updateObjectInStorage("surveys", { id: id, name: name }, function (results) { callback(results); });
    }
  };
}

module.exports = PostgresDBAdapter;
