FROM node:14-slim

WORKDIR /usr/src/app
VOLUME /usr/src/app/node_modules

COPY . .

RUN npm i
RUN npm i -g nodemon
RUN npm i -g sequelize-cli

EXPOSE 8080
CMD [ "npm", "run development" ]