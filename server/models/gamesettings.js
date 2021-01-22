const mongoose = require("mongoose");

const GameSettingsSchema = new mongoose.Schema({
    timeLimit: Number,
    mapSize: Number,
    marcoVision: Number,
    marcoBomb : Number,
    marcoReach : Number,
    poloVision : Number,
    poloBomb : Number,
});

module.exports = mongoose.model("gamesettings", GameSettingsSchema);
