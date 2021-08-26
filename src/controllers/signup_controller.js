import { isInputDataValid } from '../helpers/inputValidator';
import { createUser } from '../database/mongoCRUD/create_mongo';
import { createUserNode } from '../database/neo4jCRUD/create_neo4j';
import { verifyGoogleToken } from '../helpers/verifyToken';
import { createToken } from '../helpers/create_token';
const debug = require('debug')('app:signup');

export const signup = async (req, res, next) => {

  // TODO: createUserSearchKeys

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


  try {

    debug('Sign up...');

    // Verify token
    const userId = await verifyGoogleToken(userData.token);
    debug(`User id: ${userId}`);

    const user = {
      _id: userId,
      name: userData.name,
      username: userData.username,
      avatar: userData.avatar,
    };

    // Save user on graph
    const userNode = await createUserNode(user);

    // Save user on db
    if (userNode) {

      const newUser = await createUser(user);
      const accessToken = await createToken(userId);

      return res.json({
        message: 'User successfully created! User logged in!',
        token: accessToken,
        userId: userId,
        username: newUser.username,
        name: newUser.name,
        avatar: newUser.avatar,
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
