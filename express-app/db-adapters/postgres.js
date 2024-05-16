const fs = require("fs");
const SQLCRUDAdapter = require("./sql-crud-adapter");
const SurveyStorage = require("./survey-storage");

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

const Pool = require('pg').Pool
const pool = new Pool(dbConfig);

function PostgresStorage(session) {
  function queryExecutorFunction() {
    if(!!process.env.DATABASE_LOG) {
      console.log(arguments[0]);
      console.log(arguments[1]);
    }
    return pool.query.apply(pool, arguments);
  }
  const dbQueryAdapter = new SQLCRUDAdapter(queryExecutorFunction);
  return new SurveyStorage(dbQueryAdapter);
}

module.exports = PostgresStorage;
