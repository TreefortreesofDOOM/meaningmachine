require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const config = require('./config');
//const speakButton = document.getElementById('speakButton');

const app = express();
const PORT = config.port || 3000;

app.use(bodyParser.raw({ type: 'application/json' }));
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});