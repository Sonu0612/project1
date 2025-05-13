const express = require("express");
const profileRouter = express.Router();
const authenticateToken = require('../MIDDLEWARES/userAuth');
const { findUserByLoginName } = require('../MODELS/user');
// Profile Route
profileRouter.get('/profile/view', authenticateToken, async (req, res) => {
    try {
      const user = await findUserByLoginName(req.user.loginName);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
      console.log({user});
      
    } catch (err) {
      console.error("Profile error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
 

profileRouter.patch('/profile/edit', authenticateToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const updates = { ...req.body };

    // Prevent updates to password and email
    delete updates.password;
    delete updates.email;

    // Optional: Validate 'age' type
    if ('age' in updates && typeof updates.age !== 'number') {
      return res.status(400).json({ message: "'age' must be a number" });
    }

    // Update user in DB
    const result = await db.collection('users').updateOne(
      { loginName: loggedInUser.loginName },
      { $set: updates }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    console.log(`Updated user ${loggedInUser.loginName} with`, updates);

    const updatedUser = await findUserByLoginName(loggedInUser.loginName);
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Error in PATCH /profile/edit:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports=profileRouter