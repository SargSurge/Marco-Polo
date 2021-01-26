const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Room = require("./models/room");
const Message = require("./models/message");
const GameState = require("./models/gamestate");
const GameSettings = require("./models/gamesettings");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

//import game logic
const logic = require("./logic");

// id generator for game codes
const hri = require("human-readable-ids").hri;

router.post("/login", auth.login);
router.post("/logout", auth.logout);
//router.get("/whoami", (req, res) => {
//  if (!req.user) {
//    // not logged in
//    return res.send({});
//  }
//  res.send(req.user);
//});

router.get("/whoami", async (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  let user = await User.findById(req.user._id);
  res.send(user);
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
                    room
                      .save()
                      .then(() => {
                        socketManager.getIo().to(gameId).emit("updateLobbiesAll");
                        user.currentGame = gameId;
                        user.save().then(() => {
                          GameState.findOne({ gameId: gameId }).then((gameState) => {
                            let playersObject = {};
                            let playersArray = room.players;
                            for (let i = 0; i < playersArray.length; i++) {
                              let player = playersArray[i];
                              playersObject[player._id] = {
                                position: { x: 0, y: 0 },
                                user: player,
                                color: "white",
                                role: "polo",
                                //powerups: { lightbomb: 45 },
                              };
                            }
                            gameState.players = playersObject;
                            gameState.save().then(() => {
                              res.send({
                                msg: "Joined " + room.name + ".",
                                canJoin: true,
                              });
                            });
                          });
                        });
                      })
                      .catch((err) => console.log(err));
                  } else {
                    socketManager.userJoinRoom(req.user, gameId);
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
    socketManager.getIo().emit("updateLobbiesAll");
    User.findOne({ googleid: req.user.googleid }).then((user) => {
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
            let playersObject = {};
            let playersArray = newRoom.players;
            for (let i = 0; i < playersArray.length; i++) {
              let player = playersArray[i];
              playersObject[player._id] = {
                position: { x: 0, y: 0 },
                user: player,
                color: "white",
                role: "polo",
                //powerups: { lightbomb: 45 },
              };
            }

            let gamesettings = new GameSettings({
              timeLimit: 6,
              mapSize: 2,
              marcoVision: 100,
              marcoRadar: 15,
              marcoTimer: 20,
              poloVision: 250,
              poloTP: 50,
            });

            const gameState = new GameState({
              gameId: gameId,
              winner: null,
              players: playersObject,
              settings: gamesettings,
              finalTime: null,
            });

            gameState.save().then(res.send({ gameId: gameId }));
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

router.get("/chat", (req, res) => {
  Room.findOne({ gameId: req.query.gameId })
    .then((room) => {
      if (room) {
        res.send(room.chat);
      }
    })
    .catch((err) => console.log(err));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  // insert this message into the database
  const { gameId, content } = req.body;
  const message = new Message({
    gameId: gameId,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: content,
  });
  socketManager.getIo().to(gameId).emit("new_message", message);
  Room.findOneAndUpdate(
    { gameId: gameId },
    { $push: { chat: message } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send(message);
});

router.post("/updateLobbySettings", (req, res) => {
  const { gameId, settings } = req.body;
  Room.findOne({
    gameId: gameId,
  })
    .then((lobby) => {
      if (lobby) {
        lobby.settings = settings;
        lobby
          .save()
          .then((lobby) => socketManager.getIo().to(gameId).emit("updateLobbySettings", lobby))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
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
  logic.updatePlayerPosition(dir, gameId, userId);
  res.send({});
});

// Might be an issue, remember about this later  //////////////////
router.post("/leavegame", (req, res) => {
  if (req.user) {
    let socket = socketManager.getSocketFromUserID(req.user._id);
    socketManager.userLeaveGame(socket);
  }
  res.send({});
});
/*
router.post("/creategame", (req, res) => {
  const { gameId } = req.body;

  Room.findOne({ gameId: gameId }).then((room) => {
    let playersObject = {};
    let playersArray = room.players;
    for (let i = 0; i < playersArray.length; i++) {
      let player = playersArray[i];
      playersObject[player._id] = {
        position: { x: 0, y: 0 },
        user: player,
        color: "white",
        role: "marco",
        powerups: { lightbomb: 45 },
      };
    }

    const gameState = new GameState({
      gameId: gameId,
      winner: null,
      players: playersObject,
    });

    gameState.save().then({});
  });
});
*/
router.post("/startGame", (req, res) => {
  const { gameId } = req.body;
  Room.findOne({ gameId: gameId }).then((room) => {
    let gamesettings = new GameSettings({
      timeLimit: room.settings["General SettingsTime Limit0"],
      mapSize: room.settings["General SettingsMap Size1"],
      marcoVision: room.settings["Marco SettingsVision Radius0"],
      marcoRadar: room.settings["Marco SettingsThermal Radar Timer1"],
      marcoTimer: room.settings["Marco SettingsTag Timer2"],
      poloVision: room.settings["Polo SettingsVision Radius0"],
      poloTP: room.settings["Polo SettingsInstant Transmission Timer1"],
    });
    let player = room.players[Math.floor(Math.random() * room.players.length)];
    const roleToUpdate = `players.${player._id}.role`;
    GameState.findOneAndUpdate(
      { gameId: gameId },
      {
        $set: {
          [roleToUpdate]: "marco",
          settings: gamesettings,
          finalTime: new Date().getTime() + gamesettings.timeLimit * 60000,
        },
      },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      }
    );
    room.delete();
    socketManager.getIo().emit("updateLobbiesAll");
  });
  res.send({});
});

router.get("/initialRender", (req, res) => {
  const { gameId } = req.query;
  GameState.findOne({ gameId: gameId }).then((gameState) => {
    res.send({ initialRender: gameState });
  });
});

router.post("/leaveGameState", (req, res) => {
  const {gameId} = req.body;
  if (req.user) {
    GameState.findOne({ gameId: gameId }).then((gamestate) => {
      if (gamestate) {
        delete gamestate.players[req.user._id];
        gamestate
          .save()
          .then((gamestate) => {
            if (Object.keys(gamestate.players).length === 0) {
              GameState.deleteOne({ gameId: gameId })
                .then((result) => console.log("deleted one gamestate"))
                .catch((err) => console.log("Delete failed with error: ${err}"));
            }
          })
          .then(socketManager.getIo().in(gameId).emit("updatePoloLeft"));
      }
    });
    User.findOneAndUpdate(
      { googleid: req.user.googleid },
      { $set: { currentGame: null } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
        }
        //console.log(doc);
      }
    );  
  }
  res.send({});
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
