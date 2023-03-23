const express = require('express');

//Middleware
const auth = require('../middleware/auth');

//Controller
const {
    create,
    login,
    logout,
    logoutAll,
    getMyAccount,
    getUser,
    updateUserDetails,
    deleteMyAccount
} = require("../controllers/user.controller");
const router = new express.Router();


router.post('/', create);

router.post('/login', login);


router.use(auth);

router.post('/logout', logout);

router.post('/logoutAll', logoutAll);

router.get('/me', getMyAccount);

router.patch('/me', updateUserDetails);

router.delete('/me',deleteMyAccount );

router.get('/:userId', getUser);

module.exports = router;