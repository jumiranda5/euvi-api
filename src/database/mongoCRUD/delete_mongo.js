import User from '../models/userModel';
import Follow from '../models/followModel';
const debug = require('debug')('app:mongo');

export const deleteUser = async (userId) => {

  const del = await User.deleteOne({_id: userId});

  const count = del.deletedCount;

  if (count === 0) {
    const error = new Error(`${userId} not found`);
    error.status = 404;
    throw error;
  }
  else {
    debug('User deleted on mongo.');
    return count;
  }

};

export const deleteFollowDocument = async (from, to) => {

  const followId = `${from}=>${to}`;

  const del = await Follow.deleteOne({_id: followId});

  const count = del.deletedCount;
  if (count === 0) {
    const error = new Error(`${followId} not found`);
    error.status = 404;
    throw error;
  }
  else {
    debug('Follow deleted on mongo.');
    return count;
  }

}
