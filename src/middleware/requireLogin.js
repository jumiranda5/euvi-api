import { verifyAccessToken } from '../helpers/verifyToken';

export function requireLogin(req, res, next) {

  // TODO...

  /*
  const token = req.body.token;

  if (token) {
    verifyToken(token);
    return next();
  }
  else {
    const err = new Error('User not logged in.');
    err.status = 401;
    return next(err);
  }
  */

  // todo
  return next();

}
