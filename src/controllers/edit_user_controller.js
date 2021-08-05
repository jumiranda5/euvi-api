import User from '../database/userModel';
import { isInputDataValid } from '../helpers/inputValidator';
import { getUserSearchKeys } from '../helpers/userHelper';
import chalk from 'chalk';
const debug = require('debug')('app:edit-profile');
const debugDb = require('debug')('app:database');

export const edit_user = async (req, res, next) => {

  // User data
  const userId = req.params.userId;
  const username = req.body.username;
  const name = req.body.name;

  debug(`user id: ${chalk.green(userId)}`);
  debug(`new username: ${chalk.green(username)}`);
  debug(`new name: ${chalk.green(name)}`);

  // validate input data
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }


  // TODO: upload image or keep url from google


  // update user on db

  debug('Update user on db...');

  try {

    // create search keys
    const searchKeys = await getUserSearchKeys(username, name);

    const userObject = {
      _id: userId,
      username: username,
      name: name,
      searchKeys: searchKeys,
      avatar: ""
    };

    // Update user on db
    const editedUser = await updateUser(userObject);

    return res.json(editedUser);

  }
  catch(error) {
    res.status(error.status || 500);
    return res.json( { message: error.message });
  }

};

/* ______________ DATABASE ______________ */

const updateUser = async (userData) => {

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
    debugDb(`Updating user...`);
    const user = await User.findOneAndUpdate(query, update, options).exec();

    debugDb(`New user info =>
           username: ${user.username},
           name: ${user.name},
           avatar: ${user.avatar}`);

    return user;
  }
  catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      const err = new Error(`Username must be unique`);
      err.status = 422 ;
      debugDb(err.message);
      throw err;
    }
    else throw error;
  }

};
