
const main = require('../CONFIG/database');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

let dbPromise = main();

const insertUser = async (userData) => {
    try {
        const db = await dbPromise;
        const collection = db.collection('user');
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        const user = await collection.insertOne(userData);
        return user;
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
};

const findUser = async (userData) => {
    try {
        const db = await dbPromise;
        const collection = db.collection('user');
        const user = await collection.findOne({ loginName: userData.loginName });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(userData.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        throw error;
    }
};

const findUserById = async (_id) => {
    try {
        const db = await dbPromise;
        const collection = db.collection('user');
        const user = await collection.findOne({ _id: new ObjectId(_id) });
        return user;
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error;
    }
};

const findUserByLoginName = async (userData) => {
    try {
        const db = await dbPromise;
        const collection = db.collection('user');
        console.log(userData);
        
        const user = await collection.findOne({ loginName:userData });
        return user;
    } catch (error) {
        console.error("Error finding user by loginName:", error);
        throw error;
    }
};

module.exports = {
    insertUser,
    findUser,
    findUserById,
    findUserByLoginName
};
