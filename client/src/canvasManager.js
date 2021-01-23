let canvas;
let canvasMap;
let canvasDark;
let vision;

let tileSize = 50;
let charSize = Math.floor(tileSize / 4);
let camera;

/** utils */

export const collisionManager = (isY, x, y, intent) => {
  let left = x - charSize;
  let right = x + charSize;
  let up = y + charSize;
  let down = y - charSize;

  //console.log(left, right, up, down);

  let templeft = left + canvasMap.width / 2;
  let tempright = right + canvasMap.width / 2;
  let tempup = up + canvasMap.height / 2;
  let tempdown = down + canvasMap.height / 2;

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

  let displacement = 0.01;

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
  if (!canvasMap) return;
  return {
    drawX: canvasMap.width / 2 + x,
    drawY: canvasMap.height / 2 - y,
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

/*
export const drawAllPlayers = (drawState) => {
  const { drawX, drawY } = convertCoordToCanvas(x, y);

  context.globalCompositeOperation = "destinaton-out";

  let gradient = context.createRadialGradient(drawX, drawY, 20, drawX, drawY, 100);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(0.5, "grey");
  gradient.addColorStop(0.9, "black");
  gradient.addColorStop(1, "black");
  fillCircle(context, drawX, drawY, 100, gradient);
  context.globalCompositeOperation = "source-over";
  fillCircle(context, drawX, drawY, 20, color);
};
*/



export const drawOtherPlayers = (drawState, userId,context) => {
  Object.keys(drawState.players).map((id, index) => {
    if (id !== userId) {
      const { x, y } = drawState.players[id].position;
      const color = "green"; // drawState.player.color
      drawPlayer(context, x, y, color);
    }
  });
};

const drawTile = (context, x, y, color) => {
  context.fillStyle = color;
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  context.fillStyle = "red";
  context.font = "10pt sans-serif";
  context.fillText(y + "," + x, x * tileSize + 10, y * tileSize + 20);
};

const clamp = (value, min, max) => {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
};

/** main draw */
export const drawCanvas = (drawState,userId) => {
  // get the canvas element
  canvasMap = document.getElementById("map-layer");
  canvasDark = document.getElementById("darkness-layer");


  if (drawState.players[userId].role === "marco") {
    vision = drawState.settings.marcoVision;
  } else {
    vision = drawState.settings.poloVision;
  }

  //canvasMap = document.getElementById("game-canvas");
  
  if (!canvasMap) return;

  canvasDark.height = map.length * tileSize;
  canvasDark.width = map[0].length * tileSize;

  const { x, y } = drawState.players[userId].position;

  const { drawX, drawY } = convertCoordToCanvas(x, y);

  const darkContext = canvasDark.getContext("2d");

  darkContext.setTransform(1, 0, 0, 1, 0, 0);
  darkContext.clearRect(0, 0, canvasDark.width, canvasDark.height);

  //darkContext.globalCompositeOperation = "destinaton-out";


  //fillCircle(darkContext, drawX, drawY, 60, "white");
  //darkContext.beginPath();
  //darkContext.arc(drawX, drawY, 100, 0, 2 * Math.PI, false);
  //darkContext.clip();

  //darkContext.globalCompositeOperation = "destinaton-out";
 // darkContext.fillStyle = "black";
  //darkContext.fillRect(0, 0, canvasDark.width, canvasDark.height);
  //darkContext.beginPath();
  //darkContext.arc(drawX, drawY, 100, 0, 2 * Math.PI, false);
  //darkContext.clip();
  

  //darkContext.clearRect(0,0,x,y);
  
  //let gradient = darkContext.createRadialGradient(drawX, drawY, 20, drawX, drawY, 60);
  //gradient.addColorStop(0, "white");
  //gradient.addColorStop(0.5, "grey");
  //gradient.addColorStop(0.9, "black");
  //gradient.addColorStop(1, "black");
  //darkContext.globalCompositeOperation = "destination-out";
  //fillCircle(darkContext, drawX, drawY, 60, "white");
  
  const context = canvasMap.getContext("2d");

  canvasMap.height = map.length * tileSize;
  canvasMap.width = map[0].length * tileSize;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvasMap.width, canvasMap.height);

  context.translate(-x + map[0].length / 2, y - map.length / 2);
  darkContext.translate(-x + map[0].length / 2, y - map.length / 2);

  context.fillStyle = "rgba(38, 38, 38, 1)";
  context.fillRect(0, 0, canvasDark.width, canvasDark.height);
  

  context.beginPath();
  context.arc(drawX, drawY, 100, 0, 2 * Math.PI, false);
  context.clip();
  
  
  
  let gradient = darkContext.createRadialGradient(drawX, drawY, charSize, drawX, drawY, 100);
  console.log(vision);
  let opacity = 0.5; //55% visible
  
  
  
  gradient.addColorStop(0.005,'rgba(255,255,255,'+opacity+')');
  //gradient.addColorStop(0.5,'rgba(255,255,255,'+0.2+')');
  //gradient.addColorStop(0.9,'rgba(255,255,255,'+0.1+')');
  gradient.addColorStop(1,'transparent');
  //gradient.addColorStop(0, "white");
  //gradient.addColorStop(0.5, "grey");
  //gradient.addColorStop(0.9, "black");
  //gradient.addColorStop(1, "black");
  //darkContext.globalCompositeOperation = "destination-out";
  fillCircle(darkContext, drawX, drawY, 100, gradient);
  drawPlayer(darkContext, x, y, "red");
  //context.scale(2, 2);
  //darkContext.translate(-x + map[0].length / 2, y - map.length / 2);
  //dcontext.scale(2, 2);
  map.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile !== 0) {
        drawTile(context, j, i, "black");
      }
    });
  });
  

  //darkContext.fillStyle = lingrad;
  //darkContext.fillRect(0, 0, canvas.width, canvas.height);
  //darkContext.globalCompositeOperation = "source-over";

  

  
  

  // Makes the canvas responsive to width changes

  // Helps fix blurry canvas issue
  //let dpi = window.devicePixelRatio;
  //let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  //let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  //canvas.setAttribute("height", style_height * dpi);
  //canvas.setAttribute("width", style_width * dpi);
  //{players: [{x: 0, y: 0, color: white}]}

  

 

  
  //let camX = clamp(-x + canvas.width / 2, 0, map[0].length - canvas.width/2);
  //let camY = clamp(-y + canvas.height / 2, 0, map.length - canvas.height/2);
  //context.translate(camX, camY);

  // clear the canvas to black
  
  
  drawOtherPlayers(drawState, userId,context);
/*
  const { drawX, drawY } = convertCoordToCanvas(x, y);

  const darkContext = canvasDark.getContext("2d");

  darkContext.setTransform(1, 0, 0, 1, 0, 0);
  darkContext.clearRect(0, 0, canvasDark.width, canvasDark.height);

  //darkContext.globalCompositeOperation = "destinaton-out";


  //fillCircle(darkContext, drawX, drawY, 60, "white");
  //darkContext.beginPath();
  //darkContext.arc(drawX, drawY, 100, 0, 2 * Math.PI, false);
  //darkContext.clip();

  //darkContext.globalCompositeOperation = "destinaton-out";
  darkContext.fillStyle = "black";
  darkContext.fillRect(0, 0, canvasDark.width, canvasDark.height);
  //darkContext.beginPath();
  //darkContext.arc(drawX, drawY, 100, 0, 2 * Math.PI, false);
  //darkContext.clip();
  

  //darkContext.clearRect(0,0,x,y);
  
  let gradient = darkContext.createRadialGradient(drawX, drawY, 20, drawX, drawY, 60);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(0.5, "grey");
  gradient.addColorStop(0.9, "black");
  gradient.addColorStop(1, "black");
  //darkContext.globalCompositeOperation = "destination-out";
  fillCircle(darkContext, drawX, drawY, 60, "white");
  
  
  

  //darkContext.fillStyle = lingrad;
  //darkContext.fillRect(0, 0, canvas.width, canvas.height);
  darkContext.globalCompositeOperation = "source-over";
  drawPlayer(darkContext, x, y, "red");
  
  //darkContext.clearRect(0, 0, canvasDark.width, canvasDark.height);
*/

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
