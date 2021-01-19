// gameState = {winner: null/user, players : {id : { position : {x :  1, y:  1},  user, color : orange, role : marco/polo, powerups : {type : cooldown}}}}
const GameState = require("./models/gamestate");

const SPEED = 20;
const dirMap = {
  up: ["y", 1],
  down: ["y", -1],
  right: ["x", 1],
  left: ["x", -1],
};

let gameStates = {};

update = async (userId, gameId, dir, io) => {
  const posToUpdate = `players.${userId}.position.${dirMap[dir][0]}`;
  let stream = await GameState.findOneAndUpdate(
    { gameId: gameId },
    {
      $inc: { [posToUpdate]: SPEED * dirMap[dir][1] },
      new: true,
    }
  );
  return stream;
};

updatePlayerPosition = (userId, gameId, dir, io) => {
  let stream = update(userId, gameId, dir, io);
  gameStates[gameId] = stream;
};

/*
updatePlayerPosition = (userId, gameId, dir, io) => {
  const posToUpdate = `players.${userId}.position.${dirMap[dir][0]}`;
  GameState.findOneAndUpdate(
    { gameId: gameId },
    {
      $inc: { [posToUpdate]: SPEED * dirMap[dir][1] },
    }
  )
    .then((gameState1) => {
      gameState = gameState1;
      //io.in(gameId).emit("update", gameState);
    })
    .catch((e) => {
      console.log(e);
    });
};
 */

module.exports = {
  updatePlayerPosition: updatePlayerPosition,
  gameStates: gameStates,
};

// updatePlayerPosition = (dir, gameId, userId) => {
//     GameState.findOne({gameId: gameId}).then((gameState) => {
//         if (userId) {
//             let {x, y} = gameState.players[userId].position;
//             if (dirMap[dir][0] == 'x') {
//                 x += (SPEED * dirMap[dir][1]);
//             } else {
//                 y += (SPEED * dirMap[dir][1]);
//             }

//             console.log('dir', dirMap[dir][0])
//             console.log('increment', SPEED * dirMap[dir][1])

//             gameState.players[userId].position[dirMap[dir][0]] =  gameState.players[userId].position[dirMap[dir][0]] + (SPEED * dirMap[dir][1]);

//             console.log('position', gameState.players[userId].position);

//             // gameState.players[userId].position = {x: x, y: y};

//             gameState.save().then(() => {
//                 console.log('updated pos', gameState.players[userId].position)
//                 socketManager.getIo().in(gameId).emit("update", gameState);
//             });
//         }
//         else {
//             console.log(userId);
//         }
//     });
// }

//findandupdate({query},{action}).then()

//{$push : {array: toadd}}
//{$set : {var:value},$push}
