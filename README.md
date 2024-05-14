# SurveyJS + NodeJS + PostgreSQL Demo Example

This demo shows how to integrate [SurveyJS](https://surveyjs.io/) components with a NodeJS backend with PostgreSQL database as a storage.

[View Demo Online](https://surveyjs-nodejs.azurewebsites.net/)

## Disclaimer

This demo must not be used as a real service as it doesn't cover such real-world survey service aspects as authentication, authorization, user management, access levels, and different security issues. These aspects are covered by backend-specific articles, forums, and documentation.

## Run the Application

Install [NodeJS](https://nodejs.org/) on your machine.
Install [Docker Desktop](https://docs.docker.com/desktop/) on your machine.
After that, run the following commands:

```bash
git clone https://github.com/surveyjs/surveyjs-nodejs-complex.git
cd surveyjs-nodejs-complex
docker compose up -d
```

Open http://localhost:9080 in your web browser.

## Client-Side App

The client-side part is the `surveyjs-react-client` React application. The current project includes only the application's build artifacts in the /public folder. Refer to the [surveyjs-react-client](https://github.com/surveyjs/surveyjs-react-client) repo for full code and information about the application.
