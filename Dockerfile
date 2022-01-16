FROM node:16-slim

WORKDIR /usr/src/app

COPY . .

RUN npm i
RUN npm i -g nodemon
RUN npm i -g sequelize-cli
RUN npm i -g mocha
RUN npm i -g nyc
RUN npm i -g .

EXPOSE 8080
CMD [ "npm", "run development" ]