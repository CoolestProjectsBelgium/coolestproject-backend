# Swagger generated server

## Overview
This application is the backend component of the coolestproject website.

This application is based on swagger-codegen.

### Example development flow
wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.9/swagger-codegen-cli-2.4.9.jar -O swagger-codegen-cli.jar
java -jar swagger-codegen-cli.jar help
java -jar swagger-codegen-cli.jar generate -i ~/Downloads/openapi.yaml -o ./coolestproject-backend/ -l nodejs-server

### Running the server
To run the server, run:

```
npm start
```

npx nodemon run start 

To view the Swagger UI interface:

```
open http://localhost:8080/docs
```

### Prepare the development enviroment
create .env file in project folder
```
EMAIL=info@coolestproject.be
DB=mysql://coolestproject:***@***/coolestproject
NODE_ENV=development

MAIL_HOST=***
MAIL_PORT=2525
MAIL_USER=***
MAIL_PASS=***
```
initialize database
```
npx sequelize db:create
```
