import { graphDriver } from '../graphConfig';
const debug = require('debug')('app:neo4j');

export const createUserNode = async (userObject) => {

  const userId = userObject._id;
  const username = userObject.username;
  const name = userObject.name;
  const avatar = userObject.avatar;

  const graphSession = graphDriver.session();

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`CREATE (n:User{
        userId: '${userId}',
        username: '${username}',
        name: '${name}',
        avatar: '${avatar}'
      }) RETURN n`)
    );
    debug(`Created user node: ${result.records.length}`);
  }
  catch (error) {
    debug(error);
  }
  finally {
    await graphSession.close();
  }

};
