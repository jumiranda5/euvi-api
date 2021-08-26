import { findFollowing } from '../database/neo4jCRUD/read_neo4j';
const debug = require('debug')('app:follow');

export const following = async (req, res, next) => {

  const userId = req.params.userId;

  // TODO: pagination...

  debug('Searching follows ...');

  try {

    const followingList = await findFollowing(userId);

    return res.json({
      message: `Found ${followingList.length} follows.`,
      result: followingList
    });

  }
  catch (error) {
    return next(error);
  }

};
