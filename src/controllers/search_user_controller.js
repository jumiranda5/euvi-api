import { isInputDataValid } from '../helpers/inputValidator';
import { searchUser, findFollowsByIdList } from '../database/mongoCRUD/read_mongo';
import chalk from 'chalk';
const debug = require('debug')('app:search');

export const search_user = async (req, res, next) => {

  // Android retrofit adding extra quote when sending search key on the request body
  // moved search key to params...

  const search = req.params.search.toLowerCase();
  const userId = req.params.userId;
  const page = req.params.page;

  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  debug(`Search key: ${chalk.yellow(search)} / Page: ${chalk.yellow(page)}`);

  const users = await searchUser(search, page);

  if(users.length !== 0) {

    // Build follows ids list to find follows
    const followIds = [];
    for (let i = 0; i < users.length; i++) {
      followIds.push(`${userId}=>${users[i]._id}`);
    }

    // Find follows
    const follows = await findFollowsByIdList(followIds);

    // Build search result user object list
    const searchResult = [];

    for (let i = 0; i < users.length; i++) {
      const user = {
        userId: users[i]._id,
        name:  users[i].name,
        avatar:  users[i].avatar,
        username:  users[i].username,
        following: false
      };

      for (let i2 = 0; i2 < follows.length; i2++) {
        if(users[i]._id === follows[i2].to) {
          debug(`${userId} is following ${users[i].username}`);
          user.following = true;
        }
      }
      searchResult.push(user);
    }

    debug(`Search result: ${JSON.stringify(searchResult)}`);

    return res.json({
      message: `Found ${searchResult.length} users.`,
      result: searchResult
    });
  }

  else return res.json({message: 'No users found.'});

};
