import config from '../config';
import mongoose from 'mongoose';
const debug = require('debug')('app:mongo');

const {
  DB : { db_name, db_user, db_pass }
} = config;

// Mongo
/*eslint-disable no-console*/
export const connectMongo = () => {

  const mongoURL = `mongodb+srv://${db_user}:${db_pass}@clustereuvi.i4ubn.mongodb.net/${db_name}?retryWrites=true&w=majority`;

  try {
    mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.log(error);
  }

  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true); // deprecation warning fix
  mongoose.set('useFindAndModify', false); // deprecation warning fix

  const mongo = mongoose.connection;

  mongo.on('connected', () => {
    debug("Mongoose default connection is open.");
  });

  mongo.on('error', (err) => {
    debug(`Mongoose default connection has occured: ${err}`);
  });

  mongo.on('disconnecting', () => {
    debug("Mongoose default connection is disconnecting");
  });

//  process.on('SIGINT', () => {
//    mongo.close(() => {
//        debug("Mongoose default connection is disconnected due to application termination");
//        process.exit(0);
//    });
//  });

};
