const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// check header and decode token
// INPUT `userId` and `name` into req.user before going to `dashboardRouter`
const authUser = (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Credential Invalid');
    }
    
    const token = authHeader.split(' ')[1];

    try {
        // jwt.verify will give us {userId, name, iat(issued at), exp}
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const {userId, name} = decode;
        req.user = { userId, name }
        next();
    } catch (error) {
        throw new UnauthenticatedError('Credential Invalid');
    }
}

module.exports = authUser;
