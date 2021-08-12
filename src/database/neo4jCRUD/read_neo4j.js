import { graphDriver } from '../graphConfig';
const debug = require('debug')('app:neo4j');

export const checkIfUserNodeExists = async (userId) => {

  const graphSession = graphDriver.session();

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`MATCH (n:User{userId: '${userId}'}) RETURN n`)
    );

    debug(`user found: ${result.records.length}`);

    if (result.records.length !== 0) { return true; }
    else { return false; }

  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }
};
