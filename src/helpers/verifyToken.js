import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import config from '../config';
const debug = require('debug')('app:verify-token');

// Google
const CLIENT_ID = config.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Jwt
const TOKEN_SECRET = config.TOKEN_SECRET;

export const verifyGoogleToken = async (token) => {

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

export const verifyAccessToken = (accessToken) => {

  return new Promise((resolve, reject) => {
    try {
      const dec = jwt.verify(accessToken, TOKEN_SECRET);
      debug( `Token verified.`);
      resolve(dec);
    }
    catch (error) {
      debug("Invalid token");
      reject("Invalid token");
    }
  });

};
