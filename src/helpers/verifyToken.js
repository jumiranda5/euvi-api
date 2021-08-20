import { OAuth2Client } from 'google-auth-library';
import config from '../config';
const debug = require('debug')('app:verify-token');

const CLIENT_ID = config.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const verifyToken = async (token) => {

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload.sub;
    debug(`Token verified.`);
    return userid;
  }
  catch (error) {
    debug("Invalid token");
    throw error;
  }

};
