import { createFollow } from '../database/neo4jCRUD/create_neo4j';
const debug = require('debug')('app:follow');

export const follow = async (req, res, next) => {

  // TODO: validate param ?

  try {

    const to = req.params.to;
    const from = req.params.userId;
    debug(`User: ${ from } following ${ to }`);

    await createFollow(from, to);

    debug('Follow relationship created!');

    return res.json(`User ${from} followed ${to}`);
  }
  catch (error){
    return next(error);
  }
};
