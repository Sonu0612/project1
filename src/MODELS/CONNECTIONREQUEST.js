const { MongoClient } = require('mongodb'); // Capital M for MongoClient

const validation = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fromUserid", "toUserid", "status"],
      properties: {
        fromUserid: {
          bsonType: "objectId",
          description: "must be a valid ObjectId"
        },
        toUserid: {
          bsonType: "objectId",
          description: "must be a valid ObjectId"
        },
        status: {
          bsonType: "string",
          enum: ["ignore", "interested", "accepted", "rejected"],
          description: "must be one of 'ignore', 'interested', 'accepted', or 'rejected'"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
};

module.exports = validation;
