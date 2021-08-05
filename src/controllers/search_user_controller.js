import User from '../database/userModel';
import { isInputDataValid } from '../helpers/inputValidator';
import chalk from 'chalk';
const debug = require('debug')('app:search');
const debugDb = require('debug')('app:database');

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


const searchUser = async (search, page) => {

  //const query = [{ $match: {"searchKeys": search} }];
  //const users = await User.aggregate(query); => aggregate vs find??

  debug(`Page: ${page}`);
  const nPerPage = 25;

  const users = await User.find({searchKeys: search},
                                  ['_id', 'username', 'name', 'avatar'])
                          .skip(page > 0 ? ( ( page - 1 ) * nPerPage ) : 0)
                          .limit(nPerPage)
                          .exec();

  debugDb(users);
  return users;

};
