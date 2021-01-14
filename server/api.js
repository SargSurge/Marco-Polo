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

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

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
  Room.findOne({ gameId: gameId }).then((room) => {
    if (room) {
      if (room.numberJoined < room.capacity) {
        socketManager.userJoinRoom(req.user, socketManager.getSocketFromUserID(req.user._id), gameId);
        room.numberJoined = room.numberJoined + 1;
        room.save().then(() => {
          res.send({
            msg: 'Joined ' + room.name + '.',
          })
        })
      } else {
        res.send({
          msg: room.name + ' is full.',
        })
      }
    } else {
      res.send({
        msg: 'The lobby you are looking for does not exist.'
      })
    }
  })
})

router.post("/hostgame", (req, res) => {
  const { name, capacity, public } = req.body;
  const gameId = hri.random();
  if (req.user) {
    socketManager.userJoinRoom(req.user, socketManager.getSocketFromUserID(req.user._id), gameId);
    const newRoom = new Room({
      name: name,
      creator: req.user.name,
      capacity: capacity,
      public: public,
      numberJoined: 1,
      gameId: gameId,
    })
    newRoom.save().then(() => res.send({ gameId: gameId }));
  }
})


// Fake lobby data
const data = {
  lobbies: {
    lobby1: {
      id: 1234,
      creator: "Surge",
      capacity: 5,
      users: ["Naseem"],
    },
    lobby2: {
      id: 12345,
      creator: "Naseem",
      capacity: 7,
      users: ["Naseem", "Naseem", "Naseem"],
    },
    lobby3: {
      id: 12346,
      creator: "Sabi",
      capacity: 5,
      users: ["Naseem", "Naseem"],
    },
    lobby4: {
      id: 12347,
      creator: "Entropy",
      capacity: 9,
      users: ["Naseem", "Naseem", "Naseem", "Naseem", "Naseem", "Naseem", "Naseem"],
    },
  },
};

// returns lobby data for the public table
router.get("/lobbies", (req, res) => {
  Room.find({ public: true }).then((rooms) => {
    res.send({lobbies: rooms})
  })
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
