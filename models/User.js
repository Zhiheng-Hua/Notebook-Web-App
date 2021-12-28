const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name must be provided'],
        minLength: 3,
        maxLenght: 20
    },
    email: {
        type: String,
        required: [true, 'email must be provided'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide a valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password must be provided'],
        minLength: 6
    }
});

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {userId: this._id, name: this.name}, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_LIFETIME }
    );
}

UserSchema.methods.checkPassword = async function(candPassword) {
    const isMatch = await bcrypt.compare(candPassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);
