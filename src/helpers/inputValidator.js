import { body, validationResult } from 'express-validator';
const debug = require('debug')('app:validator');

/*eslint dot-location: 0*/

export const validateSignup = [

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email.'),
  body('name')
    .matches(/^[a-zA-Z ]{1,100}$/u)
    .withMessage('Invalid name')
    .trim()
    .escape(),
  body('avatarUrl')
    .optional(true)
    .isURL()

];

export const validateEditProfile = [
  body('username')
    .isLength({min: 3, max:100})
    .withMessage('Should be from 3 to 100 characters')
    .matches(/^[a-zA-Z0-9._-]{1,100}$/u)
    .withMessage('Invalid username')
    .trim()
    .escape(),
  body('name')
    .matches(/^[a-zA-Z ]{1,100}$/u)
    .withMessage('Invalid name')
    .trim()
    .escape(),
];


/* __________ VALIDATION FUNCTIONS __________ */

export const isSignUpDataValid = (req) => {

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    debug(validationErrors.array());
    return false;
  }
  else {
    debug('Validation passed!');
    return true;
  }

};
