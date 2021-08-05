import Follow from '../database/models/followModel';
const debug = require('debug')('app:follow');
const debugDb = require('debug')('app:database');

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


/* ================================================
                      DATABASE
=================================================== */

const deleteFollow = async (from, to) => {

  const followId = `${from}=>${to}`;

  const del = await Follow.deleteOne({_id: followId});

  const count = del.deletedCount;

  if (count === 0) {
    debugDb('Follow not found.');
    const error = new Error(`Follow not found`);
    error.status = 404;
    throw error;
  }
  else {
    debugDb("Follow deleted on db!");
    return count;
  }

};

