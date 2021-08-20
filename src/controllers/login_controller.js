import { isInputDataValid } from '../helpers/inputValidator';
import { getUsernameFromEmail } from '../helpers/userHelper';
import { checkIfUserExists } from '../database/mongoCRUD/read_mongo';
import { verifyToken } from '../helpers/verifyToken';
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
  const userId = await verifyToken(userData.token);
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
  const isUserSaved = await checkIfUserExists(userId);

  if (isUserSaved) {

    debug('User already exist... authenticate');

    return res.json({message: 'User exists => init authentication...'});

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
