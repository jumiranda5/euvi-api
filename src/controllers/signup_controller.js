import { isInputDataValid } from '../helpers/inputValidator';
import { createUser } from '../database/mongoCRUD/create_mongo';
import { createUserNode } from '../database/neo4jCRUD/create_neo4j';
const debug = require('debug')('app:signup');

export const signup = async (req, res, next) => {

  // Input data
  const userData = {
    userId: req.body.userId.trim(),
    name: req.body.name,
    username: req.body.username,
    avatar: req.body.avatarUrl,
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

    // Save user on db
    const newUser = await createUser(userData);

    // Save user on graph
    await createUserNode(userData);

    // send welcome email
    // todo...

    return res.json({
      message: 'User successfully created!',
      user: newUser
    });

  }
  catch (error) {
    return next(error);
  }

};
