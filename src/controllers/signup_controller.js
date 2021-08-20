import { isInputDataValid } from '../helpers/inputValidator';
import { createUser } from '../database/mongoCRUD/create_mongo';
import { createUserNode } from '../database/neo4jCRUD/create_neo4j';
import { verifyToken } from '../helpers/verifyToken';
const debug = require('debug')('app:signup');

export const signup = async (req, res, next) => {

  // Input data
  const userData = {
    token: req.body.token,
    name: req.body.name,
    username: req.body.username,
    avatar: req.body.avatar,
  };

  // Validate input data
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  // Verify token
  const userId = await verifyToken(userData.token);
  debug(`User id: ${userId}`);

  const user = {
    _id: userId,
    name: userData.name,
    username: userData.username,
    avatar: userData.avatar,
  };

  try {

    debug('Sign up...');

    // Save user on graph
    const userNode = await createUserNode(user);

    // Save user on db
    if (userNode) {
      const newUser = await createUser(user);

      // todo...
      // send welcome email
      // login

      return res.json({
        message: 'User successfully created!',
        user: newUser
      });
    }
    else {
      const signupError = new Error("Error on creating user node.");
      signupError.status = 500;
      return next(signupError);
    }

  }
  catch (error) {
    return next(error);
  }

};
