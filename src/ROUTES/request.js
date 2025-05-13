const express = require('express');
const requestRouter = express.Router();
const { ObjectId } = require('mongodb');
const { findUserByLoginName } = require('../MODELS/user');
const authenticateToken = require('../MIDDLEWARES/userAuth');
const main = require('../CONFIG/database');

requestRouter.post('/request/send/:status/:toUserid', authenticateToken, async (req, res) => {
  try {
    const db = await main();
    const collection = db.collection('connectionRequests');
    const fromUser = await findUserByLoginName(req.user.loginName); 
    console.log(fromUser);

    const fromUserId = fromUser._id; 
    const toUserId = new ObjectId(req.params.toUserid);  
    const status = req.params.status; 

    const allowedStatus = ["ignore", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status type", status });
    }
    if(fromUserId.toString()==toUserId.toString())
    {
        return res.status(404).json({message:"cannot send request to requesting user"})
    }
    const existingConnectionRequest = await collection.findOne({
      $or: [
        {fromUserId,toUserId},
        { fromUserid: fromUserId, toUserid: toUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists" });
    }

    // Create the new connection request
    const connectionRequest = {
      fromUserid: fromUserId,
      toUserid: toUserId,
      status,
      createdAt: new Date()
    };

    const result = await collection.insertOne(connectionRequest);

    res.json({
      message: "Connection request sent successfully!",
      data: result.ops?.[0] || connectionRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
requestRouter.post('/request/review/:status/:requestId', authenticateToken, async (req, res) => {
    try {
      const db = await main();
      const collection = db.collection('connectionRequests');
    console.log("Using collection:", collection.collectionName);
      const { status, requestId } = req.params;
      const loggedInUser = await findUserByLoginName(req.user.loginName); 
      console.log(loggedInUser);
  console.log(req.params);
  
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }
      const connectionRequest = await collection.findOne({
          fromUserid:loggedInUser._id,
            toUserid:  new ObjectId(requestId),
            status: "interested"
          });
  
      if (!connectionRequest) {
        return res.status(404).json({ message: "Connection request not found" });
      }
  console.log(connectionRequest._id);
  
     const updated = await collection.updateOne(
        { _id: connectionRequest._id},
        { $set: { status } }
      );
  
      res.json({ message: `Connection request ${status}`,updated });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

module.exports = requestRouter;
