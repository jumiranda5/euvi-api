import express from 'express';
const router = express.Router();

// router callback functions:
// User
import { home } from './controllers/home_controller';
import { access } from './controllers/access_controller';
import { login } from './controllers/login_controller';
import { signup } from './controllers/signup_controller';
import { edit_user } from './controllers/edit_user_controller';
import { delete_account } from './controllers/delete_account_controller';
import { search_user } from './controllers/search_user_controller';
import { profile } from './controllers/profile_controller';
// follow
import { follow } from './controllers/follow';
import { followers } from './controllers/followers';
import { following } from './controllers/following';
import { unfollow } from './controllers/unfollow';
// Search TMDB
import { search_tmdb_multi } from './controllers/search_multi_controller';
import { item_search_multi } from './controllers/tmdb_item_controller';

// todo: middleware to validate api key
import { validateLogin, validateEditUser, validateSearch } from './middleware/inputValidator';
import { requireLogin } from './middleware/requireLogin';

// todo: middleware to require login

/* ------- HOME ------- */

router.get('/', home);
router.get('/api', access);

/* ------- AUTH ------- */

router.post('/api/login', validateLogin, login);
router.post('/api/signup', validateEditUser, signup);

/* ------- USER ------- */

router.get('/api/user/profile/:userId/:visitor', requireLogin, profile);
router.post('/api/user/edit-user/:userId', [requireLogin, validateEditUser], edit_user);
router.post('/api/user/delete-account/:userId', requireLogin, delete_account);
router.post('/api/user/search/:userId/:page/:search', [requireLogin, validateSearch], search_user);

/* ------- FOLLOWS ------- */

router.get('/api/following/:userId', following);
router.get('/api/followers/:userId', followers);
router.post('/api/follow/:userId/:to', follow);
router.post('/api/unfollow/:userId/:to', unfollow);

/* -------- TMDB -------- */
router.get('/api/search/multi/:query/:page/:lang', search_tmdb_multi);
router.get('/api/tmdb/item/:type/:itemId/:lang', item_search_multi);

module.exports = router;
