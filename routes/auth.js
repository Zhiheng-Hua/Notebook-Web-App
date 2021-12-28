const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');

/* Login/Register Router */
// post request
// loginRouter: /api/v1/login
// registerRouter: /api/v1/register

router.route('/login').post(login);
router.route('/register').post(register);


module.exports = router;