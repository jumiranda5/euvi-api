import { isInputDataValid } from '../helpers/inputValidator';
import { searchUser } from '../database/mongoCRUD/read_mongo';
import chalk from 'chalk';
const debug = require('debug')('app:search');

export const search_user = async (req, res, next) => {

  const search = req.body.search.toLowerCase();
  //const userId = req.params.userId;
  const page = req.params.page;

  debug(`Search key: ${chalk.yellow(search)} / Page: ${chalk.yellow(page)}`);

  // validate input data
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  debug('Search user on db...');

  const users = await searchUser(search, page);

  if(users.length !== 0) {
    return res.json(users);
  }
  else {
    return res.json({message: 'No users found.'});
  }
};
