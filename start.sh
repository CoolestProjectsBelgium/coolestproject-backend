#!/bin/bash
cd /home/site/wwwroot
npm ci -g .
#npx sequelize db:create
#npx sequelize db:migrate
#npx sequelize db:seed:all --url 