const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    name: String,
    creator: String,
    gameId: String,
    players: Array,
    winner: String,
})

module.exports = mongoose.model("match", MatchSchema);