import { graphDriver } from '../graphConfig';
const debug = require('debug')('app:neo4j');

export const createUserNode = async (userObject) => {

  const userId = userObject._id;
  const username = userObject.username;
  const name = userObject.name;
  const avatar = userObject.avatar;

  const graphSession = graphDriver.session();

  try {
    const result = await graphSession.writeTransaction(tx =>
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
    throw error;
  }
  finally {
    await graphSession.close();
  }

};

export const createFollow = async (from, to) => {

  const graphSession = graphDriver.session();

  try {
    await graphSession.writeTransaction(tx =>
      tx.run(`
        MATCH (from:User), (to:User)
        WHERE from.userId = '${from}' AND to.userId = '${to}'
        MERGE (from)-[r:follows]->(to)
      `)
    );
    debug(`Follow created`);
  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }

};