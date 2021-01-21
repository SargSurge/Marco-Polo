let canvas;

let tileSize = 50;
let charSize = Math.floor(tileSize / 4);
/** utils */

export const collisionManager = (isY, x, y, intent) => {
  let left = x - charSize;
  let right = x + charSize;
  let up = y + charSize;
  let down = y - charSize;

  //console.log(left, right, up, down);

  let templeft = left + canvas.width / 2;
  let tempright = right + canvas.width / 2;
  let tempup = up + canvas.height / 2;
  let tempdown = down + canvas.height / 2;

  let tryPositionleft = null;
  let tryPositionright = null;
  let tryPositionup = null;
  let tryPositiondown = null;

  if (isY) {
    tryPositionup = Math.floor(tempup + intent);
    tryPositiondown = Math.floor(tempdown + intent);
  } else {
    tryPositionleft = Math.floor(templeft + intent);
    tryPositionright = Math.floor(tempright + intent);
  }

  let displacement = 1;

  if (isY) {
    /*
    console.log("Y");
    console.log(
      Math.abs(map.length - Math.floor(tryPositionup / tileSize)) - 1,
      Math.floor(templeft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tryPositionup / tileSize)) - 1,
      Math.floor(tempright / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tryPositiondown / tileSize)) - 1,
      Math.floor(templeft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tryPositiondown / tileSize)) - 1,
      Math.floor(tempright / tileSize)
    );
     */

    if (
      map[Math.abs(map.length - Math.floor(tryPositionup / tileSize)) - 1][
        Math.floor(templeft / tileSize)
      ] !== 0
    ) {
      return y - displacement;
    } else if (
      map[Math.abs(map.length - Math.floor(tryPositionup / tileSize)) - 1][
        Math.floor(tempright / tileSize)
      ] !== 0
    ) {
      return y - displacement;
    } else if (
      map[Math.abs(map.length - Math.floor(tryPositiondown / tileSize)) - 1][
        Math.floor(templeft / tileSize)
      ] !== 0
    ) {
      return y + displacement;
    } else if (
      map[Math.abs(map.length - Math.floor(tryPositiondown / tileSize)) - 1][
        Math.floor(tempright / tileSize)
      ] !== 0
    ) {
      return y + displacement;
    }
  } else {
    /*
    console.log("X");
    console.log(
      Math.abs(map.length - Math.floor(tempup / tileSize)) - 1,
      Math.floor(tryPositionleft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tempdown / tileSize)) - 1,

      Math.floor(tryPositionleft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tempup / tileSize)) - 1,

      Math.floor(tryPositionright / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tempdown / tileSize)) - 1,

      Math.floor(tryPositionright / tileSize)
    );
     */

    if (
      map[Math.abs(map.length - Math.floor(tempup / tileSize)) - 1][
        Math.floor(tryPositionleft / tileSize)
      ] !== 0
    ) {
      return x + displacement;
    } else if (
      map[Math.abs(map.length - Math.floor(tempup / tileSize)) - 1][
        Math.floor(tryPositionright / tileSize)
      ] !== 0
    ) {
      return x - displacement;
    } else if (
      map[Math.abs(map.length - Math.floor(tempdown / tileSize)) - 1][
        Math.floor(tryPositionleft / tileSize)
      ] !== 0
    ) {
      return x + displacement;
    } else if (
      map[Math.abs(map.length - Math.floor(tempdown / tileSize)) - 1][
        Math.floor(tryPositionright / tileSize)
      ] !== 0
    ) {
      return x - displacement;
    }
  }

  return isY ? y + intent : x + intent;
};

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoordToCanvas = (x, y) => {
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
  const { drawX, drawY } = convertCoordToCanvas(x, y);
  fillCircle(context, drawX, drawY, charSize, color);
};

export const drawAllPlayers = (drawState) => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");

  // draw all the players
  Object.keys(drawState.players).map((id, index) => {
    const { x, y } = drawState.players[id].position;
    const color = "green"; // drawState.player.color
    drawPlayer(context, x, y, color);
  });
};

const drawTile = (context, x, y, color) => {
  context.fillStyle = color;
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  context.fillStyle = "red";
  context.font = "10pt sans-serif";
  context.fillText(y + "," + x, x * tileSize + 10, y * tileSize + 20);
};

/** main draw */
export const drawCanvas = (drawState) => {
  // get the canvas element
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");

  // Makes the canvas responsive to width changes

  // Helps fix blurry canvas issue
  //let dpi = window.devicePixelRatio;
  //let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  //let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  //canvas.setAttribute("height", style_height * dpi);
  //canvas.setAttribute("width", style_width * dpi);

  canvas.height = map.length * tileSize;
  canvas.width = map[0].length * tileSize;

  // clear the canvas to black
  context.clearRect(0, 0, canvas.width, canvas.height);
  map.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile !== 0) {
        drawTile(context, j, i, "black");
      }
    });
  });

  drawAllPlayers(drawState);
};

// 11 rows
// 27 columns
export const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
