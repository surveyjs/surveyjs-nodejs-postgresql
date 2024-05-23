# SurveyJS + NodeJS + PostgreSQL Demo Example

This demo shows how to integrate [SurveyJS](https://surveyjs.io/) components with a NodeJS backend using a PostgreSQL database as a storage.

[View Demo Online](https://surveyjs-nodejs.azurewebsites.net/)

## Disclaimer

This demo must not be used as a real service as it doesn't cover such real-world survey service aspects as authentication, authorization, user management, access levels, and different security issues. These aspects are covered by backend-specific articles, forums, and documentation.

## Run the Application

1. Install [NodeJS](https://nodejs.org/) and [Docker Desktop](https://docs.docker.com/desktop/) on your machine.

2. Run the following commands:

    ```bash
    git clone https://github.com/surveyjs/surveyjs-nodejs-postgresql.git
    cd surveyjs-nodejs-postgresql
    docker compose up -d
    ```

3. Open http://localhost:9080 in your web browser.

## Client-Side App

The client-side part is the `surveyjs-react-client` React application. The current project includes only the application's build artifacts in the [public](./public/) directory. Refer to the [`surveyjs-react-client`](https://github.com/surveyjs/surveyjs-react-client) repo for full code and information about the application.

## Integrate SurveyJS with PostgreSQL

SurveyJS communicates with any database using JSON objects that contain either survey schemas or user responses. An SQL database should have two tables to store these objects: `surveys` and `results`. You can use the following SQL script to create them: [`surveyjs.sql`](postgres/initdb/surveyjs.sql). The diagram below shows the structure of these tables:

![SurveyJS: The structure of database tables](https://github.com/surveyjs/surveyjs-nodejs-postgresql/assets/18551316/176a0e1d-963c-4ec0-a11d-33631aa05770)

To modify data in the `surveys` and `results` tables, you need to implement several JavaScript functions. According to the tasks they perform, these functions can be split into three modules:

- **SQL query builder**        
JS functions that construct CRUD SQL queries (see the [`sql-crud-adapter.js`](express-app/db-adapters/sql-crud-adapter.js) file).

- **SQL query runner**         
JS functions that execute queries in an SQL database. The repository you are viewing includes a query runner for PostgreSQL databases (see the [`postgres.js`](express-app/db-adapters/postgres.js) file). You can use it as an example to create a query runner for any other SQL database.

- **Survey storage**        
JS functions that provide an API for working with survey schemas and user responses (see the [`survey-storage.js`](express-app/db-adapters/survey-storage.js) file). This API is used by the NodeJS application router (see the [`index.js`](express-app/index.js) file).

These modules interact with each other as shown on the following diagram:

![SurveyJS PostgreSQL Integration](https://github.com/surveyjs/surveyjs-nodejs-postgresql/assets/18551316/2676bb99-d5a1-40fb-b0bb-c780c382e177)

If you want to integrate SurveyJS with other databases, you can modify or replace the query builder and query runner without changing the survey storage module. This approach is applied to MongoDB integration in the following repository: [`surveyjs-nodejs-mongodb`](https://github.com/surveyjs/surveyjs-nodejs-mongodb).
