import Follow from '../database/models/followModel';
import User from '../database/models/userModel';
const debug = require('debug')('app:follow');
const debugDb = require('debug')('app:database');

export const followers = async (req, res, next) => {

  const followersList = [];

  const buildFollower = (followers, followingIds) => {

    const result = new Promise((resolve) => {

      for (let i = 0; i < followers.length; i++) {

        const follower = {
          "_id": followers[i]._id,
          "name": followers[i].name,
          "avatar": followers[i].avatar,
          "username": followers[i].username,
          "following": false
        };

        for (let i2 = 0; i2 < followingIds.length; i2++) {

          if (follower._id === followingIds[i2].to) {
            follower.following = true;
            debug(`you follow back ${followers[i].username}`);
            break;
          }

        }

        followersList.push(follower);

        if (followers[i] === followers.length -1) resolve();

      }
    });

    result.then();

  };

  try {

    const userId = req.params.userId;

    debug('Searching followers (ids)...');
    const followersIds = await findFollowers(userId);

    debug('Searching followers (users)...');
    const followers = await findUserFollowers(followersIds);

    debug('Searching follows...');
    const followingIds = await findFollows(userId);

    debug('Matching follows with followers (follow back)...');

    buildFollower(followers, followingIds);

    debug(followersList);

    return res.json({followers: followersList});

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


const findFollowers = async (userId) => {

  const followers = await Follow.find({to: userId}, ['from']).exec();

  debugDb(`Found ${followers.length} follows.`);

  return followers;

};

const findUserFollowers = async (followersList) => {

  const idList = [];

  const loopResult = new Promise((resolve) => {
    for (let i = 0; i < followersList.length; i++) {
      idList.push(followersList[i].from);

      if (followersList[i] === followersList.length -1) resolve();

    }
  });

  loopResult.then();

  const followers = await User.find({"_id" : { $in : idList} },
    ['username', 'avatar', 'name']
  ).exec();

  return followers;
};

const findFollows = async (userId) => {

  const follows = await Follow.find({from: userId}, ['to']).exec();

  debugDb(`Found ${follows.length} follows.`);

  return follows;

};
