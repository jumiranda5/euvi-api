import { verifyAccessToken } from "../helpers/verifyToken";
const debug = require('debug')('app:api-access');

export const access = async (req, res, next) => {

  if ( req.headers['x-auth-token']) {

    debug('Session header found. Verify token...');
    const accessToken = req.headers['x-auth-token'];

    try {
      await verifyAccessToken(accessToken);
      debug('Valid access token');
      return res.json({message: 'Valid access token'});
    }
    catch (error) {
      debug('Token validation error');
      return res.json({message: 'Invalid access token'});
    }

  }
  else {
    debug(`User not logged in.`);
    return res.json({message: 'Invalid access token'});
  }

};
