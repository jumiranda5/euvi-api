import { verifyToken } from '../helpers/verifyToken';

export function requireLogin(req, res, next) {

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

}
