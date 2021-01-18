// gameState = {winner: null/user, players : {id : { position : {x :  1, y:  1},  user, color : orange, role : marco/polo, powerups : {type : cooldown}}}}
const GameState = require('./models/gamestate');
const socketManager = require("./server-socket");

const SPEED = 20;
const dirMap = {
            up: ['y',1],
            down: ['y',-1],
            right: ['x',1],
            left: ['x',-1],
        }

updatePlayerPosition = (dir, gameId, userId) => {
    GameState.findOne({gameId: gameId}).then((gameState) => {
        if (userId) {
            let {x, y} = gameState.players[userId].position;
            if (dirMap[dir][0] == 'x') {
                x = x + SPEED * dirMap[dir][1];
            } else {
                y = y + SPEED * dirMap[dir][1];
            }
            //gameState.players[userId].position[dirMap[dir][0]] += SPEED * dirMap[dir][1];
            console.log('position', {x: x, y: y});
            gameState.players[userId].position = {x: x, y: y};

            gameState.save().then(() => {
                socketManager.getIo().in(gameId).emit("update", gameState);
            });
        }
        else {
            console.log(userId);
        }
    });
}

module.exports = {
    updatePlayerPosition: updatePlayerPosition,
};

//findandupdate({query},{action}).then()

//{$push : {array: toadd}}
//{$set : {var:value},$push}
