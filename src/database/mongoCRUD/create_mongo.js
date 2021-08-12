import User from '../models/userModel';
const debug = require('debug')('app:mongo');

export const createUser = async (userData) => {
  try {
    const newUser = await User.create(userData); // .create returns a promise so you shouldn't use .exec()
    debug(`User created on mongo db!`);
    return newUser;
  }
  catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {

      let field = error.message.split(".$")[1];
      field = field.split(" dup key")[0];
      field = field.substring(0, field.lastIndexOf("_"));

      const err = new Error(`${field} must be unique`);

      field === "username" ? err.status = 419 : err.status = 420 ;

      debug(err.message);
      throw err;
    }
    else throw error;
  }
};
