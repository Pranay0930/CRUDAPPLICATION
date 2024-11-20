require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3003; // Use PORT from env or default to 3003

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder (frontend)
app.use(express.static(path.join(__dirname, 'public')));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME); // Using DB_NAME from env
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

connectToDatabase();

// API Endpoints
// Create
app.post('/items', async (req, res) => {
  try {
    const result = await db.collection("items").insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating item" });
  }
});

// Read
app.get('/items', async (req, res) => {
  try {
    const items = await db.collection("items").find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const result = await db.collection("items").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const result = await db.collection("items").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

// Catch-all route for handling frontend requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
