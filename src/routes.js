import express from 'express';
const router = express.Router();

// router callback functions:
import { home } from './controllers/home_controller';
import { login } from './controllers/login_controller';
import { edit_user } from './controllers/edit_user_controller';
import { delete_account } from './controllers/delete_account_controller';

// todo: middleware to validate api key
import { validateSignup, validateEditUser } from './helpers/inputValidator';

// todo: middleware to require login

/* ------- HOME ------- */

router.get('/', home);

/* ------- AUTH ------- */

router.post('/api/login', validateSignup, login);

/* ------- USER ------- */

router.post('/api/user/edit-user/:userId', validateEditUser, edit_user);
router.post('/api/user/delete-account/:userId', delete_account);


module.exports = router;
