# Coolest project event website

## Overview

This application is the backend component of the coolestproject website. This application is based on swagger-codegen.

## Example development flow

Generating new server version:

```bash
wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.9/swagger-codegen-cli-2.4.9.jar -O swagger-codegen-cli.jar
java -jar swagger-codegen-cli.jar help

erik@erik-***:~$ java -jar swagger-codegen-cli.jar generate -i ~/Downloads/coderdojo.yaml -o ~/coolestproject-backend -l nodejs-server
[main] INFO io.swagger.parser.Swagger20Parser - reading from /home/erik/Downloads/coderdojo.yaml
[main] INFO io.swagger.codegen.DefaultCodegen - Skipped overwriting index.js as the file already exists in /home/erik/coolestproject-backend//index.js
[main] INFO io.swagger.codegen.DefaultCodegen - Skipped overwriting package.json as the file already exists in /home/erik/coolestproject-backend//package.json
[main] INFO io.swagger.codegen.DefaultCodegen - Skipped overwriting README.md as the file already exists in /home/erik/coolestproject-backend//README.md
[main] WARN io.swagger.codegen.languages.NodeJSServerCodegen - 'host' in the specification is empty or undefined. Default to http://localhost.
[main] WARN io.swagger.codegen.DefaultGenerator - 'host' not defined in the spec. Default to 'localhost'.
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/service/LoginService.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/controllers/Login.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/service/ProjectService.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/controllers/Project.js
[main] INFO io.swagger.codegen.DefaultGenerator - Skipped generation of /home/erik/coolestproject-backend/service/RegistrationService.js due to rule in .swagger-codegen-ignore
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/controllers/Registration.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/service/UserService.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/controllers/User.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/utils/writer.js
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/api/swagger.yaml
[main] INFO io.swagger.codegen.AbstractGenerator - writing file /home/erik/coolestproject-backend/.swagger-codegen/VERSION
```

## Running development server

To run the server, run:

```bash
npm run dev
```

To view the Swagger UI interface:

```bash
open http://localhost:3000/docs
```

To view the Admin UI interface:

```bash
open http://localhost:3000/admin
```

## Prepare the development environment

create .env file in the project folder:

```INI
EMAIL=info@coolestproject.be
DB=mysql://coolestproject:***@***/coolestproject
NODE_ENV=development

MAIL_HOST=***
MAIL_PORT=2525
MAIL_USER=***
MAIL_PASS=***
```

## Initialize database

Install the correct db driver (application is tested with mysql).

more info: https://sequelize.org/master/manual/getting-started.html

you need to do this once before starting the application:
copy DB info from .env file

```bash
export DB=mysql://coolestproject:***@***/coolestproject
npx sequelize db:create
npx sequelize db:migrate
```

## Important folders

* emails: folder with all the emails
* locales: translations
* models: DB models
* config: folder with DB config file
* test: some testscripts
* migrations: DB migration files
* admin: Admin interface

## Run migrations
```bash
export DB=mysql://coolestproject:***@***/coolestproject
npx sequelize db:migrate 
npx sequelize db:migrate:undo
```