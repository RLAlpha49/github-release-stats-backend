const axios = require('axios');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Save stats to database
async function saveStats(req, res) {
    const repo = req.params.repo;
    const stats = req.body; // Get the stats from the request body

    let timestamp = new Date().toISOString(); // Get the current timestamp in ISO format
    timestamp = timestamp.replace('T', '_'); // Replace 'T' with '_'
    timestamp = timestamp.slice(0, -5); // Remove the last 5 characters (".sssZ")

    await client.connect();
    const collection = client.db("GithubReleaseStats").collection("stats");

    // Save the stats under a timestamp key in the stats object
    const update = {
        $set: {
            [`stats.${timestamp}`]: stats
        }
    };

    // Update the document for the repo, upserting if it doesn't exist
    await collection.updateOne({repo: repo}, update, {upsert: true});

    res.status(200).json({ message: 'Stats saved successfully' });
}

// Retrieve stats from database
async function getStats(req, res) {
    const repo = req.params.repo;

    await client.connect();
    const collection = client.db("GithubReleaseStats").collection("stats");
    const stats = await collection.findOne({repo: repo});

    console.log(JSON.stringify(stats, null, 2)); // Print the stats to the console

    res.status(200).json(stats);
}

module.exports = {
    saveStats,
    getStats
};