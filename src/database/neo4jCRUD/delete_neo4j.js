import { graphDriver } from '../graphConfig';
const debug = require('debug')('app:neo4j');

export const deleteUserNode = async (userId) => {

  const graphSession = graphDriver.session();

  try {
    await graphSession.readTransaction(tx =>
      tx.run(`MATCH (n:User{userId: '${userId}'}) DELETE n`)
    );

    debug(`Deleted user node from neo4j db.`);
  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }

};

export const deleteFollow = async (from, to) => {

  const graphSession = graphDriver.session();

  try {
    await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH (from:User{userId:'${from}'})-[r:follows]->(to:User{userId:'${to}'})
        DELETE r`)
    );

    debug(`Deleted user node from neo4j db.`);
  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }
};
