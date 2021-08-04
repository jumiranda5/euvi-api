import express from 'express';
const router = express.Router();

// router callback functions:
import { home } from './controllers/home_controller';
import { login } from './controllers/login_controller';
//import { logout } from './controllers/logout';
//import { edit_user } from './controllers/edit-user';

// todo: middleware to validate api key
import { validateSignup } from './helpers/inputValidator';

// todo: middleware to require login

/* ------- HOME ------- */
router.get('/', home);

/* ------- AUTH ------- */
router.post('/api/login', validateSignup , login);


module.exports = router;
