const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:root@cluster0.xw42gtj.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the Player model schema
const playerSchema = new mongoose.Schema({
  name: String,
  team: String,
  rushingYards: Number,
  touchdownsThrown: Number,
  sacks: Number,
  fieldGoalsMade: Number,
  fieldGoalsMissed: Number,
  catchesMade: Number,
});

const Player = mongoose.model('Player', playerSchema);

// Middleware to parse JSON in request body
app.use(express.json());

// Create a new player
app.post('/players', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).send(player);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all players
app.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.send(players);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific player by ID
app.get('/players/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).send('Player not found');
    }
    res.send(player);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a player by ID
app.patch('/players/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'team', 'rushingYards', 'touchdownsThrown', 'sacks', 'fieldGoalsMade', 'fieldGoalsMissed', 'catchesMade'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send('Invalid updates');
  }

  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) {
      return res.status(404).send('Player not found');
    }
    res.send(player);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a player by ID
app.delete('/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).send('Player not found');
    }
    res.send(player);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Define a route for the root URL ("/")
app.get('/', (req, res) => {
    res.send('Welcome to the Player API');
  });
  
// Start the server
app.listen(5050, () => {
  console.log('API is running on port 5050');
});
