const { UserRefreshClient } = require("google-auth-library");
const mongoose = require("mongoose");
const gamesettings = require("./gamesettings").schema;

const GameStateSchema = new mongoose.Schema({
  gameId: String,
  winner: Object,
  players: Object,
  settings: gamesettings,
  initialTime: Number,
});

module.exports = mongoose.model("gamestate", GameStateSchema);
