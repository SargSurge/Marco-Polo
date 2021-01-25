const mongoose = require("mongoose");

const GameSettingsSchema = new mongoose.Schema({
  timeLimit: Number,
  mapSize: Number,
  marcoVision: Number,
  marcoRadar: Number,
  marcoTimer: Number,
  poloVision: Number,
  poloTP: Number,
});

module.exports = mongoose.model("gamesettings", GameSettingsSchema);
