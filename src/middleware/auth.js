const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const auth = async (req, res, next) => {

    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const decoded = jwt.verify(token, 'thisisanewcourse');

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) {
            throw new Error();
            return;
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send();
    }
}

module.exports = auth;