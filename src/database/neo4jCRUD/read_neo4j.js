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

export const findFollowers = async (userId) => {

  const graphSession = graphDriver.session();

  const followersList = [];

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH (n:User{userId:'${userId}'})<-[:follows]-(followers)
        RETURN followers`)
    );

    result.records.forEach(record => {
      const user = record.get(0).properties;
      const follower = {
        userId: user.userId,
        name: user.name,
        username: user.username,
        avatar: user.avatar
      };
      followersList.push(follower);
    });

    debug(`Found: ${result.records.length} followers`);

    return followersList;

  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }

};

export const findFollows = async (userId) => {

  const graphSession = graphDriver.session();

  const followsList = [];

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH (n:User{userId:'${userId}'})-[:follows]->(following)
        RETURN following`)
    );

    result.records.forEach(record => {
      const user = record.get(0).properties;
      const following = {
        userId: user.userId,
        name: user.name,
        username: user.username,
        avatar: user.avatar
      };
      followsList.push(following);
    });

    debug(`Following: ${result.records.length}`);

    return followsList;

  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }

};
