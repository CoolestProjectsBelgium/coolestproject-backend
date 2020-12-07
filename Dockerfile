FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g .

COPY . .

EXPOSE 8080
CMD [ "npm", "run development" ]