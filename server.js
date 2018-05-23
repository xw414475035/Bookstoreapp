// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const methodOverride = require('method-override');
const cors = require('cors');

//use plugin to ready data from .env file
require('dotenv').config();

/*
 |--------------------------------------
 | MongoDB
 |--------------------------------------
 */
mongoose.connect(process.env.MONGOLAB_URI);
autoIncrement.initialize(mongoose);
const monDb = mongoose.connection;
monDb.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that', process.env.MONGOLAB_URI, 'is running.');
});
monDb.once('open', function callback() {
  console.info('Connected to MongoDB:', process.env.MONGOLAB_URI);
});

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

// Point static path to public
app.use(express.static(path.join(__dirname, 'public')));

// Set our api routes
const routes = require('./routes/api')();
app.use('/', routes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));