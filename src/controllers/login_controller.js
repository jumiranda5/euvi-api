import { isInputDataValid } from '../helpers/inputValidator';
import { getUsernameFromEmail, generateUserObject } from '../helpers/userHelper';
import { checkIfUserExists } from '../database/mongoCRUD/read_mongo';
import { checkIfUserNodeExists } from '../database/neo4jCRUD/read_neo4j';
import { createUserNode } from '../database/neo4jCRUD/create_neo4j';
const debug = require('debug')('app:login');

export const login = async (req, res) => {

  // Input data
  const userData = {
    userId: req.body.userId.trim(),
    email: req.body.email,
    name: req.body.name,
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

  // check if user exists on db
  const isUserSaved = await checkIfUserExists(userData.userId);

  if (isUserSaved) {

    // check if user node exists on graph db => if not => create
    const isUserNodeSaved = await checkIfUserNodeExists(userData.userId);
    debug(`User node: ${isUserNodeSaved}`);

    if (!isUserNodeSaved) {
      debug('User not found on graph. Creating node...');
      const userNodeObject = await generateUserObject(userData);
      await createUserNode(userNodeObject);
    }
    else {
      // user and node exist => login
      // TODO...
      debug('User already exist... authenticate');
    }

    return res.json({message: 'User exists => init authentication...'});

  }
  else {
    debug('User not registered.');

    // Return user object (to edit profile page for user confirmation before signing up)

    try {

      const username = await getUsernameFromEmail(userData.email);

      const userObject = {
        userId: userData.userId,
        username: username,
        name: userData.name,
        avatar: userData.avatar,
      };

      return res.json({
        message: 'User not found.',
        user: userObject
      });

    }
    catch (error) {
      res.status(error.status || 500);
      return res.json( { message: error.message });
    }

  }

};
