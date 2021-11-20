FROM node:14-slim

WORKDIR /usr/src/app
VOLUME /usr/src/app/node_modules

COPY . .

RUN npm i

EXPOSE 8080
CMD [ "npm", "run development" ]