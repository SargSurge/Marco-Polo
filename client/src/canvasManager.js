let maps = {
  smallMap: require("../src/components/pages/assets/smallMap.json"),
  mediumMap: require("../src/components/pages/assets/MediumMapFinished.json"),
};
let json;
let mapData;
let map;
let canvas = document.getElementById("game-canvas");

let camera;
let numx;
let numy;
let tilesizex = 48;
let tilesizey = 48;
let tileSize = 48;
let charSize = Math.floor(tileSize / 4);
let loadCount;
let view;
const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const FLIPPED_VERTICALLY_FLAG = 0x40000000;
const FLIPPED_DIAGONALLY_FLAG = 0x20000000;

/** utils */

// const randomIntFromInterval = (min, max) => { // min and max included 
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// export const getTeleportCoords = () => {
//   let w = view.x;
//   let h = view.y;
//   let potentialX = randomIntFromInterval(-800, 800);
//   let potentialY = randomIntFromInterval(-800, 800);
//   let tile = map[(Math.abs(mapData.height - Math.floor(potentialX / tileSize)) - 1) * mapData.width + Math.floor(potentialY / tileSize)];
//   console.log('teleport riiip', `(${potentialX}, ${potentialY})`)
//   while ( tile === 257 || tile === 218 || tile === 180 || tile === undefined) {
//     console.log('stuck');
//     potentialX = randomIntFromInterval(-w/2, w/2);
//     potentialY = randomIntFromInterval(-h/2, h/2);
//     tile = map[(Math.abs(mapData.height - Math.floor(potentialX / tileSize)) - 1) * mapData.width + Math.floor(potentialY / tileSize)];
//   }
//   console.log('tile', map[(Math.abs(mapData.height - Math.floor(potentialX / tileSize)) - 1) * mapData.width + Math.floor(potentialY / tileSize)])
//   return {x: potentialX, y: potentialY};
// }

export const collisionManager = (isY, x, y, intent) => {
  let left = x - charSize;
  let right = x + charSize;
  let up = y + charSize;
  let down = y - charSize;

  //console.log(left, right, up, down);

  let templeft = left + (mapData.width * tileSize) / 2;
  let tempright = right + (mapData.width * tileSize) / 2;
  let tempup = up + (mapData.height * tileSize) / 2;
  let tempdown = down + (mapData.height * tileSize) / 2;

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
      map[
        (Math.abs(mapData.height - Math.floor(tryPositionup / tileSize)) - 1) * mapData.width +
          Math.floor(templeft / tileSize)
      ] === 257
    ) {
      return y - displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositionup / tileSize)) - 1) * mapData.width +
          Math.floor(tempright / tileSize)
      ] === 257
    ) {
      return y - displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositiondown / tileSize)) - 1) * mapData.width +
          Math.floor(templeft / tileSize)
      ] === 257
    ) {
      return y + displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositiondown / tileSize)) - 1) * mapData.width +
          Math.floor(tempright / tileSize)
      ] === 257
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
      map[
        (Math.abs(mapData.height - Math.floor(tempup / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionleft / tileSize)
      ] === 257
    ) {
      return x + displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tempup / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionright / tileSize)
      ] === 257
    ) {
      return x - displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tempdown / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionleft / tileSize)
      ] === 257
    ) {
      return x + displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tempdown / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionright / tileSize)
      ] === 257
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
    //drawX: canvas.width / 2 + x,
    //drawY: canvas.height / 2 - y,
    //drawX: (numx * tileSize) / 2 + x,
    //drawY: (numy * tileSize) / 2 - y,
    drawX: (mapData.width * tileSize) / 2 + x,
    drawY: (mapData.height * tileSize) / 2 - y,
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

const drawPlayer = (context, x, y, color, view) => {
  const { drawX, drawY } = convertCoordToCanvas(x, y);
  fillCircle(context, drawX - view.x, drawY - view.y, charSize, color);
};

export const drawAllPlayers = (drawState, context, view) => {
  Object.keys(drawState.players).map((id, index) => {
    const { x, y } = drawState.players[id].position;
    const color = "green"; // drawState.player.color
    drawPlayer(context, x, y, color, view);
  });
};

const drawTile = (context, x, y, color, view) => {
  context.fillStyle = color;
  context.fillRect(x * tileSize - view.x, y * tileSize - view.y, tileSize, tileSize);
};

const getTile = (t_ind, tilesets) => {
  let pkt = { img: null, px: 0, py: 0 };

  let i = 0;
  for (i = tilesets.length - 1; i >= 0; i--) {
    if (tilesets[i].firstgid <= t_ind) break;
  }
  pkt.img = tilesets[i].image;

  let local_ind = t_ind - tilesets[i].firstgid;
  let tilex = Math.floor(local_ind % tilesets[i].numx);
  let tiley = Math.floor(local_ind / tilesets[i].numx);
  pkt.px = tilex * tilesizex;
  pkt.py = tiley * tilesizey;

  return pkt;
};

/** main draw */
export const drawCanvas = (drawState, userId, tilesets) => {
  // get the canvas element
  if (drawState.settings.mapSize == 1) {
    json = maps.smallMap;
  } else {
    json = maps.mediumMap;
  }
  mapData = json.layers[0];
  map = mapData.data;
  numx = json.width;
  numy = json.height;

  canvas = document.getElementById("map-layer");

  if (!canvas) return;
  const context = canvas.getContext("2d");

  // Makes the canvas responsive to width changes

  // Helps fix blurry canvas issue
  //let dpi = window.devicePixelRatio;
  //let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  //let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  //canvas.setAttribute("height", style_height * dpi);
  //canvas.setAttribute("width", style_width * dpi);
  //{players: [{x: 0, y: 0, color: white}]}

  context.setTransform(1, 0, 0, 1, 0, 0);

  const { x, y } = drawState.players[userId].position;
  const { drawX, drawY } = convertCoordToCanvas(x, y);

  // clear the canvas to black
  context.clearRect(0, 0, canvas.width, canvas.height);

  view = {
    x: x - ((window.screen.width - canvas.width) / (numx * tilesizex)) * canvas.width,
    y:
      -y +
      ((window.screen.height - canvas.height) / (numy * tilesizey)) * canvas.height -
      canvas.height / 2,
    w: canvas.width,
    h: canvas.height,
  };

  context.translate(
    -x -
      ((window.screen.width - canvas.width) / (mapData.width * tileSize)) * canvas.width +
      view.x,
    y -
      ((window.screen.height - canvas.height) / (mapData.height * tileSize)) * canvas.height -
      canvas.height / 2 +
      view.y
  );

  context.fillStyle = "rgba(38, 38, 38, 1)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.arc(drawX - view.x, drawY - view.y, 100, 0, 2 * Math.PI, false);
  context.clip();

  let gradient = context.createRadialGradient(
    drawX - view.x,
    drawY - view.y,
    20,
    drawX - view.x,
    drawY - view.y,
    400
  );
  let opacity = 0.2; //55% visible
  gradient.addColorStop(1, "transparent");
  gradient.addColorStop(0.005, "rgba(255,255,255," + opacity + ")");
  fillCircle(context, drawX - view.x, drawY - view.y, 400, gradient);
  drawPlayer(context, x, y, "red", view);

  for (let layer_ind = 0; layer_ind < json.layers.length; layer_ind++) {
    if (json.layers[layer_ind].type != "tilelayer") continue;
    let d = json.layers[layer_ind].data;

    for (let tile_ind = 0; tile_ind < d.length; tile_ind++) {
      let t_id = d[tile_ind];
      if (t_id == 0) continue;
      // Bit 32 is used for storing whether the tile is horizontally flipped, bit 31 is used for the vertically flipped tiles and
      //bit 30 indicates whether the tile is flipped (anti) diagonally, enabling tile rotation

      let worldX = Math.floor(tile_ind % numx) * tilesizex;
      let worldY = Math.floor(tile_ind / numy) * tilesizey;
      worldX -= view.x;
      worldY -= view.y;

      //let gid = d[tile_ind];

      //let flipped_horizontally = Boolean(gid & FLIPPED_HORIZONTALLY_FLAG);
      //let flipped_vertically = Boolean(gid & FLIPPED_VERTICALLY_FLAG);
      //let flipped_diagonally = Boolean(gid & FLIPPED_DIAGONALLY_FLAG);
      let tpkt;
      tpkt = getTile(t_id, tilesets);
      context.drawImage(
        tpkt.img,
        tpkt.px,
        tpkt.py,
        tilesizex,
        tilesizey,
        worldX,
        worldY,
        tilesizex,
        tilesizey
      );
    }
  }
  drawAllPlayers(drawState, context, view);
};
