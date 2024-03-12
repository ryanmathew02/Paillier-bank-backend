const mongoose = require("mongoose");

const uri = process.env.mongoDb
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri);
async function run() {
    await mongoose.connect(uri);
}
run().catch(console.dir);