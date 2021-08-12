import User from '../models/userModel';
import chalk from 'chalk';
const debug = require('debug')('app:mongo');

export const checkIfUserExists = async (userId) => {

  try {
    const user = await User.findById(userId).exec();
    if (user !== null) {
      debug(`user found: ${chalk.green(user.username)}`);
      return true;
    }
    else {
      const err = new Error('Not found.');
      err.status = 404;
      err.message = 'User not found.';
      throw err;
    }
  }
  catch(error) {
    debug(error.message);
    return false;
  }

};
