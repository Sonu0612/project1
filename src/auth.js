const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send("Access denied. Token missing.");
        }

        const decodedObj = jwt.verify(token, 'Sohan@2003');
        console.log(decodedObj);
        
        const { _id } = decodedObj;
        console.log(_id);
        
        const user = await User.findUserById(_id);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Attach user to request (optional, but useful for later use)
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).send("Invalid or expired token.");
    }
};

module.exports = {
    userAuth
};
