import config from '../config';
const debug = require('debug')('app:redis');
const RedisGraph = require("redisgraph.js").Graph;

const {
  DB : { redis_pass, redis_port, redis_endpoint }
} = config;

let graph;

export const connectRedis = async () => {
  try {
    graph = new RedisGraph("euvi",
      redis_endpoint,
      redis_port,
      {password: redis_pass});

    const client = await graph._client;

    if (client !== null || client !== undefined) {
      debug('Redis graph database connection is open.');
    }
    else {
      debug('Redis not connected.');
    }
  }
  catch(error) {
    debug(error);
  }

};

export const graphDb = graph;

