import jwt from 'jsonwebtoken';
const debug = require('debug')('app:create-token');
import config from '../config';
const { TOKEN_SECRET } = config;

export const createToken = (userId) => {

  return new Promise((resolve, reject) => {

    try{
      const payload = { userId };
      const token = jwt.sign(payload, TOKEN_SECRET, {expiresIn: '1d'});
      debug(`Token generated: ${token}`);
      resolve(token);
    }
    catch(error) {
      reject(error);
    }

  });

};
