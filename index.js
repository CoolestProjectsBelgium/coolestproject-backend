const serverPort = process.env.PORT || 8080;
const app = require('./app');
app.listen(serverPort);