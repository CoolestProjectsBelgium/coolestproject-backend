# Coolest project event website
## Overview
This application is the backend component of the coolestproject website. This application is based on swagger-codegen.

## Example development flow
Generating new server version:

```
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

## Running the server
To run the server, run:

```
npx nodemon run start 
```

To view the Swagger UI interface:

```
open http://localhost:8080/docs
```

## Prepare the development environment
create .env file in the project folder:
```
EMAIL=info@coolestproject.be
DB=mysql://coolestproject:***@***/coolestproject
NODE_ENV=development

MAIL_HOST=***
MAIL_PORT=2525
MAIL_USER=***
MAIL_PASS=***
```

## initialize database

CLI flow:
```
export DB=mysql://coolestproject:***@***/coolestproject
npx sequelize db:create
npx sequelize db:migrate
```