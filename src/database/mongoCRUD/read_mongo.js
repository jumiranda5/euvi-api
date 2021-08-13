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

export const findUser = async (userId) => {

  try {

    const userObj = ['_id', 'username', 'name', 'avatar', 'isPrivate'];

    const user = await User.findById(userId, userObj).exec();

    if (user !== null) {
      debug(`User found: ${chalk.green(user.username)}`);
      return user;
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
    throw error;
  }
};


export const searchUser = async (search, page) => {

  debug(`Page: ${page}`);
  const nPerPage = 25;

  const users = await User.find({searchKeys: search},
                                  ['_id', 'username', 'name', 'avatar'])
                          .skip(page > 0 ? ( ( page - 1 ) * nPerPage ) : 0)
                          .limit(nPerPage)
                          .exec();

  debug(users);
  return users;

};
