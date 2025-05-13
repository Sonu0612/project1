const express = require("express");
const authRouter = express.Router();
const { insertUser, findUser} = require('../MODELS/user');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sonu";
// Signup Route
authRouter.post('/signup', async (req, res) => {
    try {
        const receivedData = req.body;
        const result = await insertUser(receivedData);
        res.status(201).json({ success: true, result });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// login Route
authRouter.post('/login', async (req, res) => {
    try {
        const receivedData = req.body;
        const user = await findUser(receivedData);
        const token = jwt.sign({ loginName: user.loginName }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
// Logout
authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged out successfully");
});
module.exports = authRouter;