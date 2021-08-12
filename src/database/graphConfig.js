import config from '../config';
import neo4j from 'neo4j-driver';
const debug = require('debug')('app:graph');

const {
  DB : { graph_pass, graph_username, graph_uri }
} = config;

const uri = graph_uri;
const user = graph_username;
const password = graph_pass;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
export const graphSession = driver.session();

export const checkGraphConnection = async () => {
  const driverConnection = await driver.verifyConnectivity();
  debug(`Graph database connection: ${driverConnection.version}`);
};

export const closeGraphDriver = async () => {

  debug("Closing Aura connection...");
  await driver.close();

};
