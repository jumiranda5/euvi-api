import { createFollow } from '../database/neo4jCRUD/create_neo4j';
import { createFollowDocument } from '../database/mongoCRUD/create_mongo';
const debug = require('debug')('app:follow');

export const follow = async (req, res, next) => {

  // TODO: validate param ?

  try {

    const to = req.params.to;
    const from = req.params.userId;
    debug(`User: ${ from } following ${ to }`);

    await Promise.all([
      createFollow(from, to),
      createFollowDocument(from, to)
    ]);

    debug('Follow relationship created!');

    return res.json(`User ${from} followed ${to}`);
  }
  catch (error){
    return next(error);
  }

};
