import Follow from '../database/models/followModel';
const debug = require('debug')('app:follow');
const debugDb = require('debug')('app:database');

export const follow = async (req, res, next) => {

  // TODO: validate param ?

  try {

    const to = req.params.to;
    const from = req.params.userId;
    debug(`User: ${ from } following ${ to }`);

    await createFollow(from, to);

    debug('Follow document created!');

    return res.json(`User ${from} followed ${to}`);
  }
  catch (error){
    debug(error.code);
    if (error.code === 11000) {
      res.status(error.status || 500);
      return res.json({ message: error.message, code: error.code });
    }
    else {
      return next(error);
    }
  }
};


/* ================================================
                      DATABASE
 ================================================== */

const createFollow = async (from, to) => {

  const _id = `${from}=>${to}`;

  try {
    const follow = await Follow.create({_id, from, to});
    debugDb(`User ${from} followed ${to}`);
    return follow;
  }
  catch (error) {

    debugDb(`Error code: ${error.code}`);
    debugDb(`Error message: ${error.message}`);

    throw error;
  }

};
