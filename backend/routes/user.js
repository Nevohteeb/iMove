const express = require('express');

const router = express.Router();

// import controller functions
const {signupUser, loginUser} = require('../controllers/userController');

// log in
router.post('/login', loginUser)

// sign up
router.post('/signup', signupUser)

module.exports = router