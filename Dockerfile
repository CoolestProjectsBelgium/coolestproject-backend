FROM node:14

WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install . 

COPY . .

RUN npm install -g .

EXPOSE 8080
CMD [ "npm", "run development" ]