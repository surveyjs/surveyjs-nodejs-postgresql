let currentId = 1;

function SurveyStorage(dbQueryAdapter) {
  
    function addSurvey(name, callback) {
      var newObj = {
        name: name || ("New Survey" + " " + currentId++),
        json: "{}"
      };
      dbQueryAdapter.create("surveys", newObj, id => { 
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
      dbQueryAdapter.create("results", newObj, id => { 
        newObj.id = id;
        callback(newObj);
      });
    }
  
    return {
      addSurvey: addSurvey,
      getSurvey: function (surveyId, callback) {
        dbQueryAdapter.retrieve("surveys", [{ name: "id", op: "=", value: "'" + surveyId + "'" }], function (results) { callback(results[0]); });
      },
      storeSurvey: function (id, name, json, callback) {
        dbQueryAdapter.update("surveys", { id: id, json: json }, function (results) { callback(results); });
      },
      getSurveys: function (callback) {
        dbQueryAdapter.retrieve("surveys", [], function (results) { callback(results); });
      },
      deleteSurvey: function (surveyId, callback) {
        dbQueryAdapter.delete("surveys", surveyId, function (results) { callback(results); });
      },
      postResults: postResults,
      getResults: function (postId, callback) {
        dbQueryAdapter.retrieve("results", [{ name: "postid", op: "=", value: "'" + postId + "'" }], function (results) { callback({ id: postId, data: results.map(r => r.json)}); });
      },
      changeName: function (id, name, callback) {
        dbQueryAdapter.update("surveys", { id: id, name: name }, function (results) { callback(results); });
      }
    };
  }

  module.exports = SurveyStorage;