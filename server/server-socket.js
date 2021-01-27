//import { updatePlayerPosition } from "./logic.js";

let io;

const Room = require("./models/room");
const User = require("./models/user");

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
// const codeToRoomMap = {}; // maps game ID to socket room

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];
const logic = require("./logic");

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

const updateLobbiesAll = (socket) => {
  socket.emit("updateLobbies");
};

const userJoinRoom = (user, gameId) => {
  const userSocket = userToSocketMap[user._id];
  userSocket.join(gameId);
};

const userLeaveGame = (socket) => {
  if (socket) {
    let roomKeys = Object.keys(socket.rooms);
    let socketIdIndex = roomKeys.indexOf(socket.id);
    roomKeys.splice(socketIdIndex, 1);
    let user = getUserFromSocketID(socket.id);

    if (user) {
      let gameId = roomKeys[0];
      Room.findOne({ gameId: gameId }).then((room) => {
        if (room) {
          console.log(room.players);
          room.numberJoined--;
          const index = room.players.findIndex((p) => p._id === user._id);
          if (index != -1) {
            room.players.splice(index, 1);
          }
          room
            .save()
            .then((room) => {
              if (room.numberJoined === 0) {
                Room.deleteOne({ gameId: gameId })
                  .then((result) => console.log("deleted one"))
                  .catch((err) => console.log("Delete failed with error: ${err}"));
              }
            })
            .then(io.emit("updateLobbiesAll"));
        }
      });
      User.findOneAndUpdate(
        { googleid: user.googleid },
        { $set: { currentGame: null } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }
};

const userMove = (socket, userId, gameId, position) => {
  if (socket) {
    logic.updatePlayerPosition(position, gameId, userId, io);
  }
};

setInterval(() => {
  Object.keys(logic.gameStates).forEach((gameId) => {
    logic.gameStates[gameId].then((out) => {
      sendGameState(out, gameId, []);
    });
  });
}, 1000 / 60);

const sendGameState = (gameState, gameId, map) => {
  io.in(gameId).emit("update", gameState);
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http, { pingTimeout: 30000 });

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("updateLobbies", () => io.emit("updateLobbiesAll"));
      socket.on("logout", () => userLeaveGame(socket));
      socket.on("disconnecting", () => userLeaveGame(socket));
      socket.on("move", (userId, gameId, position) => userMove(socket, userId, gameId, position));
      socket.on("startGame", (gameId) => io.in(gameId).emit("startGame", gameId));
      socket.on("tagged", (gameId, tagged) => {
        let gamestate = logic.tagPlayerWrapper(gameId, tagged);
        io.in(gameId).emit("update", gamestate);
      });
      socket.on("transport close", () => {
        userLeaveGame(socket);
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      socket.on("disconnect", (reason) => {
        userLeaveGame(socket);
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  userJoinRoom: userJoinRoom,
  updateLobbiesAll: updateLobbiesAll,
  userLeaveGame: userLeaveGame,
  userMove: userMove,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
