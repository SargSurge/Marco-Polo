import $ from "jquery";
import pic from "./A2_0.png";
let json = require("../src/components/pages/assets/MediumMapFinished.json");
const mapData = json.layers[0];
const map = mapData.data;
let canvas = document.getElementById("game-canvas");

let tileSize = 50;
let charSize = Math.floor(tileSize / 4);
let camera;
let numx = json.width;
let numy = json.height;
let tilesizex = json.tilewidth;
let tilesizey = json.tileheight;
let loadCount;
let view;

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
    drawX: (numx * tileSize) / 2 + x,
    drawY: (numy * tileSize) / 2 - y,
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

export const drawAllPlayers = (drawState, context) => {
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

const clamp = (value, min, max) => {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
};

const getTilePacket = (t_ind,tilesets) => {
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
  //{players: [{x: 0, y: 0, color: white}]}

  context.setTransform(1, 0, 0, 1, 0, 0);

  const { x, y } = drawState.players[userId].position;

  // clear the canvas to black
  context.clearRect(0, 0, canvas.width, canvas.height);
  //context.scale(2, 2);
  //context.translate(-x + map[0].length / 2, y - map.length / 2);
/*
  map.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile !== 0) {
        drawTile(context, j, i, "black");
      }
    });
  });*/

  

  const { drawX, drawY } = convertCoordToCanvas(x, y);

  //fillCircle(context, drawX, drawY, 20, "red");

  //let img = new Image();

  //img.onload = function () {
  //context.drawImage(img, drawX, drawY);
  //};
  //img.src = pic;

  //img.src = require("./Inside_A2.png");

  /*
  loadCount = 0;
  for (let i = 0; i < json.tilesets.length; i++) {
    let img = new Image();
    img.onload = function()
    {loadCount++}
    img.src = "../src/components/pages/assets/" + json.tilesets[i].image;
    let tileset = {firstgid:json.tilesets[i].firstgid,image:img,imagewidth:json.tilesets[i].imagewidth,imageheight:json.tilesets[i].imageheight,numx:Math.floor(json.tilesets[i].imagewidth/tilesizex),numy:Math.floor(json.tilesets[i].imageheight/tilesizey)}
    tilesets.push(tileset);
  }
*/

context.translate(
  -x - ((window.screen.width - canvas.width) / (numx * tileSize)) * canvas.width,
  y -
    ((window.screen.height - canvas.height) / (numy * tileSize)) * canvas.height -
    canvas.height / 2
);

  view = {x : x - ((window.screen.width - canvas.width) / (numx * tilesizex)) ,y : -y +
    ((window.screen.height - canvas.height) / (numy * tilesizey)) * canvas.height -
    canvas.height / 2, w : canvas.width, h : canvas.height};

  for (let layer_ind = 0; layer_ind < json.layers.length; layer_ind++) {
    if (json.layers[layer_ind].type != "tilelayer") continue;
    let d = json.layers[layer_ind].data;

    for (let tile_ind = 0; tile_ind < d.length; tile_ind++) {

      let t_id = d[tile_ind];
      if (t_id == 0) continue;
      let tpkt = getTilePacket(t_id,tilesets);
      let worldX = Math.floor(tile_ind % numx) * tilesizex;
      let worldY = Math.floor(tile_ind / numy) * tilesizey;
      //if ((worldX + tilesizex) < view.x || (worldY + tilesizey) < view.y || worldX > (view.x + view.w) || worldY > (view.y + view.h)) continue;
      worldX -= view.x;
      worldY -= view.y;
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
  drawAllPlayers(drawState, context);
};

// 11 rows
// 27 columns


/*
$(function() {
  //console.log(canvas);
  var c = canvas.getContext("2d");
  //console.log(c);

  var scene = {
    layers: [],
    renderLayer: function(layer) {
      // data: [array of tiles, 1-based, position of sprite from top-left]
      // height: integer, height in number of sprites
      // name: "string", internal name of layer
      // opacity: integer
      // type: "string", layer type (tile, object)
      // visible: boolean
      // width: integer, width in number of sprites
      // x: integer, starting x position
      // y: integer, starting y position
      if (layer.type !== "tilelayer" || !layer.opacity) { return; }
      var s = c.canvas.cloneNode(),
          size = scene.data.tilewidth;
      s = s.getContext("2d");
      if (scene.layers.length < scene.data.layers.length) {
        layer.data.forEach(function(tile_idx, i) {
          if (!tile_idx) { return; }
          var img_x, img_y, s_x, s_y,
              tile = scene.data.tilesets[0];
          tile_idx--;
          img_x = (tile_idx % (tile.imagewidth / size)) * size;
          img_y = ~~(tile_idx / (tile.imagewidth / size)) * size;
          s_x = (i % layer.width) * size;
          s_y = ~~(i / layer.width) * size;
          s.drawImage(scene.tileset, img_x, img_y, size, size,
                      s_x, s_y, size, size);
        });
        scene.layers.push(s.canvas.toDataURL());
        c.drawImage(s.canvas, 0, 0);
      }
      else {
        scene.layers.forEach(function(src) {
          var i = $({ src: src })[0];
          c.drawImage(i, 0, 0);
        });
      }
    },
    renderLayers: function(layers) {
      layers = $.isArray(layers) ? layers : this.data.layers;
      layers.forEach(this.renderLayer);
    },
    loadTileset: function(json) {
      this.data = json;
      //console.log(json);
      this.tileset = $({ src: json.tilesets[0].image })[0]
      //console.log(this.tileset);
      this.tileset.onload = $.proxy(this.renderLayers, this);
    },
  };

  scene.loadTileset("MediumMapFinished");
});
*/
