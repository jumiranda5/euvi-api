import User from '../database/models/userModel';
const debug = require('debug')('app:delete-user');
const debugDb = require('debug')('app:database');

export const delete_account = async (req, res, next) => {

  const userId = req.params.userId;

  try{

    debug('Deleting account...');

    // TODO: delete posts
    // TODO: delete likes
    // TODO: delete follows
    // TODO: delete comments
    // TODO: notifications
    // TODO: delete watchlist

    await deleteUser(userId);

    debug('Account successfully deleted!');

    return res.json({message: "Account deleted!"});
  }
  catch (error) {
    debug('User not found.');
    return next(error);
  }

};

/* ______________ DATABASE ______________ */


const deleteUser = async (userId) => {

  const del = await User.deleteOne({_id: userId});

  const count = del.deletedCount;

  if (count === 0) {
    const error = new Error(`${userId} not found`);
    error.status = 404;
    throw error;
  }
  else {
    debugDb('User deleted');
    return count;
  }

};
