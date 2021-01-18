let canvas;
/** utils */

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoord = (x, y) => {
  if (!canvas) return;
  return {
    drawX: canvas.width / 2 + x,
    drawY: canvas.height / 2 - y,
  };
};

// fills a circle at a given x, y canvas coord with radius and color
const fillCircle = (context, x, y, radius, color) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
};

/** drawing functions */

const drawPlayer = (context, x, y, color) => {
  const { drawX, drawY } = convertCoord(x, y);
  fillCircle(context, drawX, drawY, 20, color);
};

/** main draw */
export const drawCanvas = (drawState) => {
  // get the canvas element
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");

  // clear the canvas to black
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // draw all the players

  Object.keys(drawState.players).map((id, index) => {
    const {x, y} = drawState.players[id].position;
    const color = "white" // drawState.player.color
    drawPlayer(context, x, y, color);
  })

  // Object.values(drawState.players).forEach((p) => {
  //   drawPlayer(context, p.x, p.y, p.color);
  // });
};


// {players: [{x: 0, y: 0, color: white}]}

// gameState = {winner: null/user, players : {id : { position : {x :  1, y:  1},  user, color : orange, role : marco/polo, powerups : {type : cooldown}}}}



// {players: [{x:, y:, color:}]}