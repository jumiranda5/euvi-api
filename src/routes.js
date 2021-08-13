import express from 'express';
const router = express.Router();

// router callback functions:
// User
import { home } from './controllers/home_controller';
import { login } from './controllers/login_controller';
import { edit_user } from './controllers/edit_user_controller';
import { delete_account } from './controllers/delete_account_controller';
import { search_user } from './controllers/search_user_controller';
// follow
import { follow } from './controllers/follow';
import { followers } from './controllers/followers';
import { following } from './controllers/following';
import { unfollow } from './controllers/unfollow';


// todo: middleware to validate api key
import { validateSignup, validateEditUser, validateSearch } from './helpers/inputValidator';

// todo: middleware to require login

/* ------- HOME ------- */

router.get('/', home);

/* ------- AUTH ------- */

router.post('/api/login', validateSignup, login);

/* ------- USER ------- */

router.post('/api/user/edit-user/:userId', validateEditUser, edit_user);
router.post('/api/user/delete-account/:userId', delete_account);
router.post('/api/user/search/:userId/:page', validateSearch, search_user);

/* ------- FOLLOWS ------- */

router.get('/api/following/:userId', following);
router.get('/api/followers/:userId', followers);
router.post('/api/follow/:userId/:to', follow);
router.post('/api/unfollow/:userId/:to', unfollow);

module.exports = router;
