import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
const debug = require('debug')('app:');
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import { connectMongo } from './database/mongoConfig';
import { checkGraphConnection, closeGraphDriver } from './database/graphConfig';

const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods:['GET','POST'],
  credentials: false
};

// Instantiate the app
const app = express();

// database connection
connectMongo();
checkGraphConnection();

app.use(helmet());

app.use(cors(corsConfig));

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// include routes
const routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler => define as the last app.use callback
app.use((err, req, res, next) => {
  res.setHeader('Content-Type', 'application/json'); // Possible fix to doctype error... todo: test
  res.status(err.status || 500);
  res.json( { message: err.message });
});

// Invoke the app's '.listen()'
const port = config.PORT;
app.listen(port, (err) => {
  if (err) {
    debug(err);
  } else {
    debug(`Server is listening on port ${chalk.green(port)}`);
  }
});

// Disconnect dbs
process.on('SIGINT', () => {

  closeGraphDriver().then(() => {

    mongoose.connection.close(() => {
      debug("Mongoose default connection is disconnected due to application termination");
    });

  }).then(() => {

    debug("Exiting app...");
    process.exit(0);

  });
});
