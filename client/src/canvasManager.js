let maps = {
  smallMap: require("../src/components/pages/assets/smallMapRemake.json"),
  mediumMap: require("../src/components/pages/assets/MediumMapFinished.json"),
};

let json;
let mapData;
let map;
let canvas;
let isMarco = false;
let loadCountchar = 0;

let camera;
let numx;
let numy;
let tilesizex = 48;
let tilesizey = 48;
let tileSize = 48;
let charSize = Math.floor(tileSize / 4);
let loadCount;
let view;
let vision;
const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const FLIPPED_VERTICALLY_FLAG = 0x40000000;
const FLIPPED_DIAGONALLY_FLAG = 0x20000000;

/** utils */

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
  //context.drawImage(img, 0, 0, img.width, img.height, drawX - view.x, drawY - view.y, img.width*0.07,img.height*0.07);
};

export const drawAllPlayers = (drawState, context, view) => {
  Object.keys(drawState.players).map((id, index) => {
    const { x, y } = drawState.players[id].position;
    // drawState.player.color
    //console.log(loadCountchar);
    if (drawState.players[id].role === "marco") {
      context.shadowBlur = 10;
      context.shadowColor = "rgba(255, 141, 0, 1)";
      drawPlayer(context, x, y, "rgba(255, 141, 0, 1)", view);
    } else {
      context.shadowColor = "rgba(10, 126, 255, 1)";
      drawPlayer(context, x, y, "rgba(10, 126, 255, 1)", view);
    }
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
export const drawCanvas = (drawState, userId, tilesets, initial, thermal) => {
  // get the canvas element

  if (drawState.settings.mapSize === 1 && initial) {
    json = maps.smallMap;
  } else if (drawState.settings.mapSize === 2 && initial) {
    json = maps.mediumMap;
  }
  if (initial) {
    if (drawState.players[userId].role == "marco") {
      vision = drawState.settings.marcoVision;
    } else {
      vision = drawState.settings.poloVision;
    }
    /*
    marco_img = new Image();
    marco_img.onload = function () {
      loadCountchar++;
    };
    marco_img.src = marco;
    polo_img = new Image();
    polo_img.onload = function () {
      loadCountchar++;
    };
    polo_img.src = polo;*/
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
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.save();

  const { x, y } = drawState.players[userId].position;
  const { drawX, drawY } = convertCoordToCanvas(x, y);

  // clear the canvas to black

  //big map

  view = {
    x: 0,
    y:
      0,
    w: canvas.width,
    h: canvas.height,
  };

  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  //context.viewport(0, 0, canvas.width, canvas.height);
/*
  context.translate(
    -x -
      ((window.screen.width - canvas.width) / (mapData.width * tileSize)) * canvas.width +
      view.x,
    y -
      ((window.screen.height - canvas.height) / (mapData.height * tileSize)) * canvas.height -
      canvas.height / 2 +
      view.y
  );*/

  context.translate(-x - mapData.width*tileSize/2 + canvas.width/2,y-mapData.height*tileSize/2+canvas.height/2);

  context.clearRect(0, 0, canvas.width, canvas.height);
  //console.log(thermal);
  if (thermal.active) {
    if (Math.floor((new Date().getTime() - thermal.time) / 1000) % 2 == 0) {
      context.beginPath();
      context.arc(drawX - view.x, drawY - view.y, 3 * vision, 0, 2 * Math.PI, false);
      context.clip();
    } else {
      context.beginPath();
      context.arc(drawX - view.x, drawY - view.y, vision, 0, 2 * Math.PI, false);
      context.clip();
    }
  } else {
    context.beginPath();
    context.arc(drawX - view.x, drawY - view.y, vision, 0, 2 * Math.PI, false);
    context.clip();
  }

  if (drawState.players[userId].role === "marco") {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  for (let layer_ind = 0; layer_ind < json.layers.length; layer_ind++) {
    if (json.layers[layer_ind].type != "tilelayer") continue;
    let d = json.layers[layer_ind].data;

    for (let tile_ind = 0; tile_ind < d.length; tile_ind++) {
      let t_id = d[tile_ind];
      if (t_id == 0) continue;

      let worldX = Math.floor(tile_ind % numx) * tilesizex;
      let worldY = Math.floor(tile_ind / numy) * tilesizey;
      worldX -= view.x;
      worldY -= view.y;

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
  // if (isMarco) {
  //   drawPlayer(context, x, y, marco, view);
  //} else {
  //  drawPlayer(context, x, y, polo, view);
  //}
  //console.log(marco_img);
  drawAllPlayers(drawState, context, view);
  context.restore();
};
