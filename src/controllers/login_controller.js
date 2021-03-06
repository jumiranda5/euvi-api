import { isInputDataValid } from '../middleware/inputValidator';
import { getUsernameFromEmail } from '../helpers/userHelper';
import { checkIfUserExists } from '../database/mongoCRUD/read_mongo';
import { verifyGoogleToken } from '../helpers/verifyToken';
import { createToken } from '../helpers/create_token';
const debug = require('debug')('app:login');

export const login = async (req, res) => {

  // Input data
  const userData = {
    token: req.body.token,
    email: req.body.email,
    name: req.body.name,
    avatar: req.body.avatarUrl,
  };

  // Verify token
  const userId = await verifyGoogleToken(userData.token);
  debug(`User id: ${userId}`);

  // Validate input data
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  // check if user exists on db
  const savedUser = await checkIfUserExists(userId);

  if (savedUser) {

    debug('User already exist... create access token');

    // TODO: add session id to user model, add it to access token <= <= <=
    // change sid on each login to revoke previous access (?)
    const accessToken = await createToken(userId);

    return res.json({
      message: 'User logged in',
      token: accessToken,
      userId: userId,
      username: savedUser.username,
      name: savedUser.name,
      avatar: savedUser.avatar,
    });

  }
  else {
    debug('User not registered.');

    try {

      const username = await getUsernameFromEmail(userData.email);

      return res.json({
        message: 'User not found.',
        userId: userId,
        username: username,
        name: userData.name,
        avatar: userData.avatar,
      });

    }
    catch (error) {
      res.status(error.status || 500);
      return res.json( { message: error.message });
    }

  }

};
