const User = require('../models/User'); 
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('please provide both email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials: email not found');
    }
    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials: password incorrect');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

const register = async (req, res) => {
    // password hashing is being taken cared by schema pre middleware
    const user = await User.create({ ...req.body });      // await creating and storing the user into DB

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

module.exports = {
    login,
    register
}
