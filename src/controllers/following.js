import Follow from '../database/models/followModel';
import User from '../database/models/userModel';
const debug = require('debug')('app:follow');
const debugDb = require('debug')('app:database');

export const following = async (req, res, next) => {

  // Search follows => get ids
  // Search users with the ids

  const userId = req.params.userId;

  try {

    debug('Searching follows (ids) ...');
    const followsIds = await findFollows(userId);

    debug('Searching follows (users) ...');
    const following = await findUserFollows(followsIds);

    const followingList = [];

    for (let i = 0; i < following.length; i++) {

      const follow = {
        "_id": following[i]._id,
        "name": following[i].name,
        "avatar": following[i].avatar,
        "username": following[i].username,
        "following": true
      };

      followingList.push(follow);

    }

    return res.json({following: followingList});

  }
  catch (error){
    debug(error);
    res.status(error.status || 500);
    return res.json( { message: error.message });
  }

};

/* ================================================
                      DATABASE
=================================================== */

const findFollows = async (userId) => {

  const follows = await Follow.find({from: userId}, ['to']).exec();

  debugDb(`Found ${follows.length} follows.`);

  return follows;

};

const findUserFollows = async (followsList) => {

  const idList = [];

  const loopResult = new Promise((resolve) => {
    for (let i = 0; i < followsList.length; i++) {
      idList.push(followsList[i].to);
      if (followsList[i] === followsList.length -1) resolve();
    }
  });
  loopResult.then();

  const follows = await User.find({"_id" : { $in : idList} },
    ['username', 'avatar', 'name']
  ).exec();

  debug(`Found ${follows.length} users that you follow.`);

  return follows;
};
