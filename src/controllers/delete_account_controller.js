import { deleteUser } from '../database/mongoCRUD/delete_mongo';
import { deleteUserNode } from '../database/neo4jCRUD/delete_neo4j';
const debug = require('debug')('app:delete-user');

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
    // TODO: handle error when user is only deleted from one db (mongo or neo4j);

    await deleteUser(userId);
    await deleteUserNode(userId);

    debug('Account successfully deleted!');

    return res.json({message: "Account deleted!"});

  }
  catch (error) {
    debug('User not found.');
    return next(error);
  }

};
