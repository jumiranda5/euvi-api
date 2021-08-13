import { findFollows } from '../database/neo4jCRUD/read_neo4j';
const debug = require('debug')('app:follow');

export const following = async (req, res, next) => {

  const userId = req.params.userId;

  // TODO: pagination...

  debug('Searching follows ...');

  try {

    const followsList = await findFollows(userId);

    return res.json({Following: followsList});

  }
  catch (error) {
    return next(error);
  }

};
