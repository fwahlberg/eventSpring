const User = require("../models/user.model");


const create = async (req, res) => {
    const user = new User(req.body);
    try{
        // 3) Check if email already taken
        const isEmailTaken = await User.isEmailTaken(req.body.email);


        if (isEmailTaken) {
            throw new Error('Email already taken!')
        }
        await user.save()

        const token = await user.generateAuthToken()
        res.status(201).send({user, token});
    } catch (e){
        res.status(400).send(e);
    }
}
const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()

        res.send({
            user,
            token
        });
    } catch (e) {
        res.status(400).send();
    }
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send();
    } catch (e) {
        res.status(500).send();
    }
}
const logoutAll = async (req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()
        res.send();
    }catch (e) {
        res.status(500).send();
    }
}

const getUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}
const getMyAccount = async (req, res) => {
    res.send(req.user);
}

const updateUserDetails = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try {

        updates.forEach(update => {
            req.user[update] = req.body[update];
        });

        await req.user.save();


        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
}

const deleteMyAccount = async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
}
module.exports = {
    create,
    login,
    logout,
    logoutAll,
    getMyAccount,
    getUser,
    updateUserDetails,
    deleteMyAccount
};