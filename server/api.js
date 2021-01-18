/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Room = require("./models/room");
const Message = require("./models/message");
const GameState = require("./models/gamestate");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

//import game logic
const logic = require('./logic');

// id generator for game codes
const hri = require("human-readable-ids").hri;

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/joingame", (req, res) => {
  const { gameId } = req.body;

  if (req.user) {
    User.findOne({ googleid: req.user.googleid })
      .then((user) => {
        if (user && (user.currentGame === gameId || !user.currentGame)) {
          Room.findOne({ gameId: gameId }).then((room) => {
            if (room) {
              if (room.numberJoined < room.capacity) {
                if (req.user) {
                  if (!room.players.some((p) => p._id === req.user._id)) {
                    socketManager.userJoinRoom(req.user, gameId);
                    room.numberJoined++;
                    room.players.push(req.user);
                    room.save().then(() => {
                      user.currentGame = gameId;
                      user
                        .save()
                        .then(() => {
                          socketManager.getIo().to(gameId).emit("updateLobbiesAll");
                          res.send({
                            msg: "Joined " + room.name + ".",
                            canJoin: true,
                          });
                        })
                        .catch((err) => console.log(err));
                    });
                  } else {
                    res.send({
                      msg: "Joined " + room.name + " again.",
                      canJoin: true,
                    });
                  }
                } else {
                  res.send({
                    msg: "Invalid",
                    canJoin: false,
                  });
                }
              } else {
                res.send({
                  msg: room.name + " is full.",
                  canJoin: false,
                });
              }
            } else {
              res.send({
                msg: "The lobby you are looking for does not exist.",
                canJoin: false,
              });
            }
          });
        } else {
          res.send({
            msg: "You can only join one game.",
            canJoin: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }
});

router.post("/hostgame", (req, res) => {
  const { name, capacity, public, settings } = req.body;
  const gameId = hri.random();

  if (req.user) {
    User.findOne({ googleid: req.user.googleid }).then((user) => {
      console.log(user);
      if (user && (user.currentGame === gameId || !user.currentGame)) {
        user.currentGame = gameId;
        user.save();
        socketManager.userJoinRoom(req.user, gameId);
        const newRoom = new Room({
          name: name,
          creator: req.user.name,
          capacity: capacity,
          public: public,
          numberJoined: 1,
          gameId: gameId,
          settings: settings,
          players: [req.user],
          chat: [],
        });
        newRoom
          .save()
          .then(() => {
            res.send({ gameId: gameId });
          })
          .catch((err) => console.log(err));
      } else {
        res.send({
          msg: "You can only join one game.",
        });
      }
    });
  } else {
    res.send({
      msg: "Invalid",
    });
  }
});

router.get("/chat", (req,res) => {
  Room.findOne({gameId : req.query.gameId})
  .then((room) => {
    if (room) {
      res.send(room.chat);
    }
  })
  .catch((err) => console.log(err));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  // insert this message into the database
  const {gameId, content} = req.body;
  const message = new Message({
    gameId: gameId,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: content,
  });
  message.save().then((message) => socketManager.getIo().to(gameId).emit("new_message", message))
  .catch((err) => console.log(err));
  Room.findOneAndUpdate({gameId : gameId}, {$push : {chat : message}}, {new : true}, (err,doc) => {
    if (err) {
      console.log(err);
    }
  });
  res.send(message);
  });

router.post("/updateLobbySettings", (req, res) => {
  const { gameId, settings } = req.body;
  Room.findOne({
    gameId: gameId,
  }).then((lobby) => {
    if (lobby) {
      lobby.settings = settings;
      lobby
        .save()
        .then((lobby) => socketManager.getIo().to(gameId).emit("updateLobbySettings", lobby))
        .catch((err) => console.log(err));
    }
  }).catch((err) => console.log(err));
  res.send({});
});

// returns lobby data for the public table
router.get("/lobbies", (req, res) => {
  Room.find({
    public: true,
    $expr: { $lt: ["$numberJoined", "$capacity"] },
  })
    .then((rooms) => {
      res.send({ lobbies: rooms });
    })
    .catch((err) => console.log(err));
});

// returns specific lobby data
router.get("/lobby", (req, res) => {
  Room.findOne({
    gameId: req.query.gameId,
  })
    .then((lobby) => {
      res.send({ lobby: lobby });
    })
    .catch((err) => console.log(err));
});

router.post("/move", (req, res) => {
  const { dir, userId, gameId } = req.body;
  console.log("user", userId,dir);
  logic.updatePlayerPosition(dir, gameId, userId);
  res.send({});
});

router.post("/leavegame", (req, res) => {
  const { user } = req.body;
  if (user) {
    let socket = socketManager.getSocketFromUserID(user._id);
    socketManager.userLeaveGame(socket);
  }
  res.send({});
})

router.post("/creategame", (req, res) => {
  const { gameId } = req.body;
  

  Room.findOne({gameId: gameId}).then((room) => {
    console.log('room',room.players);
    let playersObject = {};
    let playersArray = room.players;
    console.log('array',playersArray);
    for (let i = 0; i < playersArray.length; i++) {
      let player = playersArray[i];
      console.log(player);
      playersObject[player._id] = {position: {x: 0, y: 0}, user: player, color: 'white', role: 'marco', powerups: {lightbomb: 45}};
    };

    console.log('playersObject', playersObject)
  
    const gameState = new GameState({
      gameId: gameId,
      winner: null,
      players: playersObject,
    });
  
    gameState.save().then(() => res.send({}));
  })
  
});


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;



// gameState = {winner: null/user, players : {id : { position : {x :  1, y:  1},  user, color : orange, role : marco/polo, powerups : {type : cooldown}}}}
