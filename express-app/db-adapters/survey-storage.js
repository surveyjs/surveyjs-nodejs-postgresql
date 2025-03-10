let currentId = 1;

function SurveyStorage (dbQueryAdapter) {
  function addSurvey (name, callback) {
    const newObj = {
      name: name || ("New Survey" + " " + currentId++),
      json: "{}"
    };
    dbQueryAdapter.create("surveys", newObj, id => { 
      newObj.id = id;
      callback(newObj);
    });
  }

  function postResults (postId, json, callback) {
    const newObj = {
      postid: postId,
      json: json
    };
    dbQueryAdapter.create("results", newObj, id => { 
      newObj.id = id;
      callback(newObj);
    });
  }

  return {
    addSurvey: addSurvey,
    getSurvey: (surveyId, callback) => {
      dbQueryAdapter.retrieve("surveys", [{ name: "id", op: "=", value: "'" + surveyId + "'" }], (results) => { callback(results[0]); });
    },
    storeSurvey: (id, _, json, callback) => {
      dbQueryAdapter.update("surveys", { id: id, json: json }, (results) => { callback(results); });
    },
    getSurveys: (callback) => {
      dbQueryAdapter.retrieve("surveys", [], (results) => { callback(results); });
    },
    deleteSurvey: (surveyId, callback) => {
      dbQueryAdapter.delete("surveys", surveyId, (results) => { callback(results); });
    },
    postResults: postResults,
    getResults: (postId, callback) => {
      dbQueryAdapter.retrieve("results", [{ name: "postid", op: "=", value: "'" + postId + "'" }], (results) => { callback({ id: postId, data: results.map(r => r.json)}); });
    },
    changeName: (id, name, callback) => {
      dbQueryAdapter.update("surveys", { id: id, name: name }, (results) => { callback(results); });
    }
  };
}

module.exports = SurveyStorage;