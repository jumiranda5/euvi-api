import { findUser } from '../database/mongoCRUD/read_mongo';
import { countFollowers, countFollows, checkIfFollowing } from '../database/neo4jCRUD/read_neo4j';
const debug = require('debug')('app:profile');

export const profile = async (req, res, next) => {

  /*
    Check if visiting own profile:
    compare userId from params to auth token user id (todo: google auth)
    for now: compare ids in params...
  */

  const userId = req.params.userId;
  const visitor = req.params.visitor;
  let isOwnProfile;
  let isFollowing;
  let responses;

  // get user info from mongo
  // count posts on mongo (todo)
  // count followers on neo4j
  // count follows on neo4j
  // find follow on neo4j (visiting other profile)

  try {

    if (visitor === userId) {

      debug('Visiting own profile.');

      isOwnProfile = true;
      isFollowing = false;

      responses = await Promise.all([
        findUser(userId),
        countFollowers(userId),
        countFollows(userId)
      ]);


    }
    else {

      debug('Visiting other user profile.');

      isOwnProfile = false;

      responses = await Promise.all([
        findUser(userId),
        countFollowers(userId),
        countFollows(userId),
        checkIfFollowing(userId, visitor)
      ]);

      isFollowing = responses[3];

    }

    const user = responses[0];
    const followers = responses[1];
    const following = responses[2];

    return res.json({
      message: 'User found!',
      isOwnProfile,
      isFollowing,
      user,
      followers,
      following,
    });

  }
  catch (error) {
    return next(error);
  }

};
