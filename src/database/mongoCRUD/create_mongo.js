import User from '../models/userModel';
import Follow from '../models/followModel';
const debug = require('debug')('app:mongo');

/* ========== USER ========== */

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

/* ========== FOLLOW ========== */

export const createFollowDocument = async (from, to) => {

  const _id = `${from}=>${to}`;

  try {
    const follow = await Follow.create({_id, from, to});
    debug(`User ${from} followed ${to}`);
    return follow;
  }
  catch (error) {

    debug(`Error code: ${error.code}`);
    debug(`Error message: ${error.message}`);

    throw error;
  }

};
