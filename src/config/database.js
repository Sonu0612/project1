
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'assetmgmt';

async function main() {
    let client;
    try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);
        console.log("connected to Database....!");
        const validation = {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["firstName", "lastName","loginName","password","email"], 
                    properties: {
                        firstName: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        lastName: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        loginName: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            }
        };
        const collections = await db.listCollections().toArray();
       // console.log(collections);
        
       let a =  collections.some((x)=>{
            if(x.name === 'user')
            {
                return true;
            }
            else
            {
                return false;
                
            }
        })
        if(a)
        {
          
            console.log("inserting to collection");
            
        }
        else
        {
       
            console.log("Collection created with validation schema!");
            await db.createCollection('user', validation);
        }
        const userCollection = db.collection('user');
        await userCollection.createIndex({ loginName: 1 }, { unique: true })
              return db;
    } catch (err) {
        console.error(err);
    } finally {
 
    }
}
module.exports = { main };
