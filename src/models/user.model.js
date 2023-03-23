const mongoose = require('mongoose');
const validator = require('validator');
const {hash, verify} = require('argon2');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password: {
        required: true,
        type: String,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password cannot be literal')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    ],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// userSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'createdBy'
// })
userSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject()

    delete userObject.password
    delete  userObject.tokens;
    return userObject
}

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};
userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({_id: user._id}, 'thisisanewcourse')

    user.tokens = user.tokens.concat({token})

    await user.save();
    return token;

}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await verify(user.password, password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}
userSchema.pre('save', async function (next ) {

    if(!this.isModified('password')) return next();
    //
    const salt = crypto.randomBytes(32);
    this.password = await hash(this.password, { salt });

    next();

});

// userSchema.pre('remove', async function(next) {
//     const user = this
//     await Task.deleteMany({createdBy: user._id})
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User;