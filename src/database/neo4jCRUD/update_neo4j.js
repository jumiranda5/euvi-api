import { graphDriver } from '../graphConfig';
const debug = require('debug')('app:neo4j');

export const updateUserNode = async (userData) => {

  const userId = userData._id;
  const username = userData.username;
  const name = userData.name;
  const avatar = userData.avatar;

  const graphSession = graphDriver.session();

  try {
    await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH (n:User {userId: '${userId}'})
        SET n += {
          username: '${username}',
          name: '${name}',
          avatar: '${avatar}'
        }`)
    );
    debug(`User node updated on neo4j`);
  }
  catch (error) {
    debug(error);
  }
  finally {
    await graphSession.close();
  }

};
