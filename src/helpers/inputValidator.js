import { body, validationResult } from 'express-validator';
const debug = require('debug')('app:validator');

/*eslint dot-location: 0*/

export const validateSignup = [

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email.'),
  body('name')
    .isLength({min: 2, max: 50})
    .withMessage('Should be from 2 to 50 characters.')
    .matches(/^[^"/%$@#.,+=:;?!<>*\\{}[\]()]{1,50}$/u)
    .withMessage('Invalid name')
    .trim(),
  body('avatarUrl')
    .optional(true)
    .isURL()
    .withMessage('Invalid url')

];

export const validateEditUser = [
  body('username')
    .isLength({min: 3, max:30})
    .withMessage('Should be from 3 to 30 characters')
    .matches(/^[a-zA-Z0-9._-]{1,30}$/u)
    .withMessage('Invalid username')
    .trim()
    .escape(),
  body('name')
    .isLength({min: 2, max: 50})
    .withMessage('Should be from 2 to 50 characters.')
    .matches(/^[^"/%$@#.,+=<>:;?!*\\{}[\]()]{1,50}$/u)
    .withMessage('Invalid name')
    .trim(),
  body('avatarUrl')
    .optional(true)
    .isURL()
    .withMessage('Invalid url')
];

export const validateSearch = [
  body('search')
    .matches(/^[^"<>\\{}[\]]{1,200}$/u)
    .withMessage('Invalid search')
    .trim()
];


/* -------------------------------------------------
                VALIDATION FUNCTIONS
 -------------------------------------------------- */

export const isInputDataValid = (req) => {

  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    debug('Validation passed!');
    return true;
  }
  else {
    debug(validationErrors.array());
    return false;
  }

};
