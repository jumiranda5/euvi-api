import { findUser, countFollowDocuments, findFollowDocument } from '../database/mongoCRUD/read_mongo';
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

  try {

    if (visitor === userId) {

      debug('Visiting own profile.');

      isOwnProfile = true;
      isFollowing = false;

      responses = await Promise.all([
        findUser(userId),
        countFollowDocuments(userId)
      ]);

    }
    else {

      debug('Visiting other user profile.');

      isOwnProfile = false;

      responses = await Promise.all([
        findUser(userId),
        countFollowDocuments(userId),
        findFollowDocument(userId, visitor)
      ]);

      isFollowing = responses[2];

    }

    const user = responses[0];
    const followers = responses[1].followers;
    const following = responses[1].following;

    return res.json({
      message: `User found! Profile of ${user.username}`,
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
