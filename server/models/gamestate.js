const { UserRefreshClient } = require("google-auth-library");
const mongoose = require("mongoose");

const GameStateSchema = new mongoose.Schema({
  gameId: String,
  winner: Object,
  players: Object,
});

module.exports = mongoose.model("gamestate", GameStateSchema);
