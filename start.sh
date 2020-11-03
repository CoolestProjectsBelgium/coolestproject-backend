#!/bin/bash
npm install
npx sequelize db:create
npx sequelize db:migrate