import express from 'express';
const router = express.Router();

const home_controller = require('./controllers/home_controller');

//------ HOME ------
router.get('/', home_controller.home);


module.exports = router;
