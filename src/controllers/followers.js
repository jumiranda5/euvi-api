import { findFollowers } from '../database/neo4jCRUD/read_neo4j';
const debug = require('debug')('app:follow');

export const followers = async (req, res, next) => {

  const userId = req.params.userId;

  // TODO: pagination...

  debug('Searching followers ...');

  try {

    const followersList = await findFollowers(userId);

    return res.json({followers: followersList});

  }
  catch (error) {
    return next(error);
  }
};
