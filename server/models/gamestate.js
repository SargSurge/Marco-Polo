const { UserRefreshClient } = require("google-auth-library");
const mongoose = require("mongoose");
const gamesettings = require("./gamesettings").schema;

const GameStateSchema = new mongoose.Schema({
  name: String,
  creator: String,
  gameId: String,
  winner: Object,
  players: Object,
  settings: gamesettings,
  finalTime: Number,
  tagged: Array,
  poloCaught: Number,
});

module.exports = mongoose.model("gamestate", GameStateSchema);
