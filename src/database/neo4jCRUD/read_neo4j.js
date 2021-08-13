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

export const countFollowers = async (userId) => {

  const graphSession = graphDriver.session();

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH ()-[r:follows]->(n:User{userId:'${userId}'})
        RETURN count(r) as count`)
    );

    const count = result.records[0].get(0).low;

    debug(`Followers count: ${count}`);

    return count;

  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }
};

export const countFollows = async (userId) => {

  const graphSession = graphDriver.session();

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH (n:User{userId:'${userId}'})-[r:follows]->()
        RETURN count(r) as count`)
    );

    const count = result.records[0].get(0).low;

    debug(`Follow count: ${count}`);

    return count;

  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }
};

export const checkIfFollowing = async (profileId, visitorId) => {

  const graphSession = graphDriver.session();

  try {
    const result = await graphSession.readTransaction(tx =>
      tx.run(`
        MATCH (a:User{userId:'${visitorId}'})-[r:follows]->(b:User{userId:'${profileId}'})
        RETURN r`)
    );

    let isFollowing;
    if (result.records.length > 0) isFollowing = true;
    else isFollowing = false;

    debug(`Following: ${isFollowing}`);

    return isFollowing;

  }
  catch (error) {
    debug(error);
    throw error;
  }
  finally {
    await graphSession.close();
  }
};
