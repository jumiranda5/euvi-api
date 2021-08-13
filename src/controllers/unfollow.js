import { deleteFollow } from '../database/neo4jCRUD/delete_neo4j';
const debug = require('debug')('app:follow');

export const unfollow = async (req, res, next) => {

  try {

    const to = req.params.to;
    const from = req.params.userId;
    debug(`User: ${ from } following ${ to }`);

    debug('Deleting follow...');
    await deleteFollow(from, to);

    debug(`User ${ to } unfollowed!`);

    return res.json(`You unfollowed ${to}`);
  }
  catch (error){
    return next(error);
  }

};
