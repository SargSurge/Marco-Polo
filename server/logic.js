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

update = async (userId, gameId, position, io) => {
  const posToUpdate = `players.${userId}.position`;
  let stream = await GameState.findOneAndUpdate(
    { gameId: gameId },
    {
      $set: { [posToUpdate]: position },
      new: true,
    }
  );
  return stream;
};

updatePlayerPosition = (userId, gameId, position, io) => {
  let stream = update(userId, gameId, position, io);
  gameStates[gameId] = stream;
};

tagPlayerUpdate = async (gameId, tagged) => {
  let toUpdate = `players.${tagged.user._id}.active`;
  let stream = await GameState.findOneAndUpdate(
    { gameId: gameId },
    {
      $set: { [toUpdate]: false },
      $inc: { poloCaught: 1 },
      $push: { tagged: tagged },
      new: true,
    }
  );
  return stream;
};

tagPlayerWrapper = (gameId, tagged) => {
  let stream = tagPlayerUpdate(gameId, tagged);
  gameStates[gameId] = stream;
  return stream;
};

module.exports = {
  updatePlayerPosition: updatePlayerPosition,
  gameStates: gameStates,
  tagPlayerWrapper: tagPlayerWrapper,
};
