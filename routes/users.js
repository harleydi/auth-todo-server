var express = require('express');
var router = express.Router();
const { checkIfEmpty } = require('../utils/checkIfEmpty')
const { validateUserData } = require('../utils/validateUserData')
const { jwtValidate } = require("../utils/jwtValidate")
const { createUser, loginUser, validateUser } = require('../controllers/usersController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', checkIfEmpty, validateUserData, createUser )
router.post('/login', checkIfEmpty, validateUserData, loginUser)
router.get('/validate', jwtValidate, validateUser)

module.exports = router;
