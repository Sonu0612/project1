const { MongoClient } = require('mongodb');
const validation = require('../UTILS/validation');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function main() {
    await client.connect();
    const db = client.db('backend');

    const collections = await db.listCollections({ name: 'user' }).toArray();
    if (collections.length === 0) {
        await db.createCollection('user', validation);
        const collectionName = "user";
        if(collectionName =='user')
        await db.collection(collectionName).createIndex({ loginName: 1 }, { unique: true });

        console.log("collection created");
    } 
    return db;
}

module.exports = main;