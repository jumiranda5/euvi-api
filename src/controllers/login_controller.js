import User from '../database/userModel';
import chalk from 'chalk';
import { isSignUpDataValid } from '../helpers/inputValidator';
import { getUsernameFromEmail, getUserSearchKeys } from '../helpers/userHelper';
const debugDb = require('debug')('app:database');
const debug = require('debug')('app:login');

export const login = async (req, res) => {

  debug(req.body);

  // Input data
  const userData = {
    userId: req.body.userId.trim(),
    email: req.body.email,
    name: req.body.name,
    avatar: req.body.avatarUrl,
  };

  // Validate input data
  const isDataValid = isSignUpDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
  }

  // check if user exists on db
  const isUserSaved = await checkIfUserExists(userData.userId);

  if (isUserSaved) {
    // if user exists => login
    debug('User already exist... authenticate');
    return res.json({message: 'User exists => init authentication...'});
  }
  else {
    debug('Create user...');

    try {
      // create username from email
      const username = getUsernameFromEmail(userData.email);

      // create search keys
      const searchKeys = await getUserSearchKeys(username, userData.name);

      const userObject = {
        _id: userData.userId,
        username: username,
        name: userData.name,
        email: userData.email,
        searchKeys: searchKeys
      };

      // Save user on db
      const newUser = await createUser(userObject);

      // send welcome email
      // todo...

      return res.json(newUser);
    }
    catch (error) {
      res.status(error.status || 500);
      return res.json( { message: error.message });
    }

  }



  // Abort request
  //let aborted = false;
  //req.on('close', () => {
  //  debug('Request aborted');
  //  aborted = true;
  //  return res.end();
  //});

};


/* ______________ DATABASE ______________ */

// CREATE
const createUser = async (userData) => {
  try {
    const newUser = await User.create(userData); // .create returns a promise so you shouldn't use .exec()
    debugDb(`User created on db!`);
    return newUser;
  }
  catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {

      let field = error.message.split(".$")[1];
      field = field.split(" dup key")[0];
      field = field.substring(0, field.lastIndexOf("_"));

      const err = new Error(`${field} must be unique`);

      field === "username" ? err.status = 419 : err.status = 420 ;

      debugDb(err.message);
      throw err;
    }
    else throw error;
  }
};

// READ
export const checkIfUserExists = async (userId) => {

  try {
    const user = await User.findById(userId).exec();
    debugDb(`user found: ${chalk.green(user.username)}`);
    return true;
  }
  catch(error) {
    debugDb(`user not found.`);
    debugDb(error.message);
    return false;
  }

};
