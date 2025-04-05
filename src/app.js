const express = require("express");
const { insertUser, findUser } = require("./models/user");
const app = express();   

app.use(express.json());  // Middleware to parse JSON request bodies

// Signup route
app.post("/signup", async (req, res) => {  
    try {
        const userData = req.body;
        console.log("Received user data:", userData);  
        const result = await insertUser(userData);  // Insert user into the database
        console.log("Insertion result:", result);  
        res.status(201).json(result);  // Respond with 201 Created status and result
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("Error adding user");  // Respond with 500 Internal Server Error
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const userData = req.body;
        console.log("Received user data:", userData);

        // Ensure loginName is provided in the request body
        if (!userData || !userData.loginName) {
            return res.status(400).json({ error: "Login name is required." });
        }

        // Query and validate the user based on loginName and password
        const result = await findUser(userData);
        console.log("User found:", result);

        res.status(200).json(result);  // Respond with the user data if login is successful
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ error: "An error occurred while finding the user." });  // Handle the error properly
    }
});

// Start the server
app.listen('3000', () => {
    console.log("Server connected and running on port 3000...");
});
