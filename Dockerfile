FROM node:18-slim
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install -g npm@9.5.1
RUN npm i
RUN npm i -g nodemon \
    && npm i -g sequelize-cli \
    && npm i -g mocha \
    && npm i -g nyc \
    && npm i -g .
COPY . .
EXPOSE 8080
CMD ["npm", "run development"]