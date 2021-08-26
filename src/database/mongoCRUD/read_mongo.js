import User from '../models/userModel';
import Follow from '../models/followModel';
import chalk from 'chalk';
const debug = require('debug')('app:mongo');

/* ========== USER ========== */

export const checkIfUserExists = async (userId) => {

  try {
    const userObj = ['_id', 'username', 'name', 'avatar', 'isPrivate'];
    const user = await User.findById(userId, userObj).exec();
    if (user !== null) {
      debug(`user found: ${chalk.green(user.username)}`);
      return user;
    }
    else {
      const err = new Error('Not found.');
      err.status = 404;
      err.message = 'User not found.';
      throw err;
    }
  }
  catch(error) {
    debug(error.message);
    return false;
  }

};

export const findUser = async (userId) => {

  try {

    const userObj = ['_id', 'username', 'name', 'avatar', 'isPrivate'];

    const user = await User.findById(userId, userObj).exec();

    if (user !== null) {
      debug(`User found: ${chalk.green(user.username)}`);
      return user;
    }
    else {
      const err = new Error('Not found.');
      err.status = 404;
      err.message = 'User not found.';
      throw err;
    }
  }
  catch(error) {
    debug(error.message);
    throw error;
  }
};

export const searchUser = async (search, page) => {

  debug(`Page: ${page}`);
  const nPerPage = 25;

  const users = await User.find({searchKeys: search},
                                  ['_id', 'username', 'name', 'avatar'])
                          .skip(page > 0 ? ( ( page - 1 ) * nPerPage ) : 0)
                          .limit(nPerPage)
                          .exec();

  debug(users);
  return users;

};


/* ========== FOLLOWS ========== */

export const findFollowsByIdList = async (idList) => {

  const follows = await Follow.find({"_id" : { $in : idList} }, ["to"]).exec();
  return follows;

};

export const countFollowDocuments = async (userId) => {

  let followersCount;
  let followingCount;

  const counts = await Follow.aggregate([
    { "$facet": {
      "following": [
        { "$match": { "from": userId } },
        { "$group": { "_id": null, n: { "$sum": 1 } } }
      ],
      "followers": [
        { "$match": { "to": userId } },
        { "$group": { "_id": null, n: { "$sum": 1 } } }
      ]
    }}
  ]);

  debug(`Counts: ${JSON.stringify(counts)}`);

  if (counts[0].following[0]) { followingCount = counts[0].following[0].n;}
  else followingCount = 0;

  if (counts[0].followers[0]) followersCount = counts[0].followers[0].n;
  else followersCount = 0;

  const followCountObj = {
    followers: followersCount,
    following: followingCount
  }

  return followCountObj;

};

export const findFollowDocument = async (profileId, visitorId) => {

  const followId = `${visitorId}=>${profileId}`;

  try {
    const follow = await Follow.findById(followId, ['_id']).exec();
    if (follow !== null) {
      debug(`follow document found: ${chalk.green(follow._id)}`);
      return true;
    }
    else return false;
  }
  catch (error) {
    debug(error.message);
    return false;
  }

};

export const findFollowersDocuments = async (userId) => {

  const followers = await Follow.find({to: userId}, ['from']).exec();

  debug(`Found ${followers.length} follows.`);

  return followers;

};

export const findFollowingDocuments = async (userId) => {

  const follows = await Follow.find({from: userId}, ['to']).exec();

  debug(`Found ${follows.length} follows.`);

  return follows;

};
