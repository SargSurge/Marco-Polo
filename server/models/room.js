const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    name: String,
    creator: String,
    capacity: Number,
    public: Boolean,
    numberJoined: Number,
    gameId: String,
    players: Array,
    settings: Object,
    chat: Array,
})

module.exports = mongoose.model("room", RoomSchema);