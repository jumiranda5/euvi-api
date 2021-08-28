import { isInputDataValid } from '../middleware/inputValidator';
import { getUserSearchKeys } from '../helpers/userHelper';
import { updateUser } from '../database/mongoCRUD/update_mongo';
import chalk from 'chalk';
import { updateUserNode } from '../database/neo4jCRUD/update_neo4j';
const debug = require('debug')('app:edit-profile');

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
    await updateUserNode(userObject);

    return res.json(editedUser);

  }
  catch(error) {
    res.status(error.status || 500);
    return res.json( { message: error.message });
  }

};


