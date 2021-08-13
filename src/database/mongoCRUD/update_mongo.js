import User from '../models/userModel';
import chalk from 'chalk';
const debug = require('debug')('app:mongo');

export const updateUser = async (userData) => {

  const userId = userData._id;
  const username = userData.username;
  const name = userData.name;
  const avatar = userData.avatar;
  const searchKeys = userData.searchKeys;

  const query = { _id: userId};
  const options = { new: true };
  let update;

  avatar === "" ?
  update = { $set: { username, name, searchKeys }} :
  update = { $set: { avatar, username, name, searchKeys }};

  try {
    debug(`Updating user...`);
    const user = await User.findOneAndUpdate(query, update, options).exec();

    debug(`Updated user =>
           username: ${chalk.green(user.username)},
           name: ${chalk.green(user.name)},
           avatar: ${chalk.green(user.avatar)}`);

    return user;
  }
  catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      const err = new Error(`Username must be unique`);
      err.status = 422 ;
      debug(err.message);
      throw err;
    }
    else throw error;
  }

};
