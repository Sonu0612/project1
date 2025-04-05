const { main } = require('../config/database');
const bcrypt = require('bcryptjs');

// Function to insert a user into the database
const insertUser = async (userData) => {
    try {
        const db = await main(); 
        const collection = db.collection('user');  
        
        console.log("connected");
        
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword; 
        const result = await collection.insertOne(userData);  
        return result; 
    } catch (error) {
        console.error("Error inserting user:", error); 
        throw error;
    }
};

const findUser = async (userData) => {
    try {
        const db = await main();
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

module.exports = { insertUser, findUser };
