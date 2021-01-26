let maps = {
  smallMap: require("../src/components/pages/assets/smallMapRemake.json"),
  mediumMap: require("../src/components/pages/assets/MediumMapFinished.json"),
};
let json;
let mapData;
let map;
let canvas;

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
export const drawCanvas = (drawState, userId, tilesets, initial) => {
  // get the canvas element
  console.log(drawState);
  if (drawState.settings.mapSize === 1 && initial) {
    console.log("small");
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

  //big map
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
  /*
  view = {
    x: x - ((canvas.width) / (numx * tilesizex)) * canvas.width,
    y:
      -y +
      ((canvas.height) / (numy * tilesizey)) * canvas.height -
      canvas.height / 2,
    w: canvas.width,
    h: canvas.height,
  };

  context.translate(
    -x -
      (1/ (mapData.width * tileSize)) * canvas.width +
      view.x,
    y -
      (1 / (mapData.height * tileSize)) * canvas.height -
      canvas.height / 2 +
      view.y
  );
  */
  /*
  context.clearRect(0, 0, canvas.width, canvas.height);
  view = {
    x: x - ((window.screen.width - canvas.width) / (60 * tilesizex)) * canvas.width/2 ,
    y:
      -y +
      ((window.screen.height - canvas.height) / (60 * tilesizey)) * canvas.height/2 +
      canvas.height ,
    w: canvas.width,
    h: canvas.height,
  };

  context.translate(
    -x -
      ((window.screen.width - canvas.width) / (60 * tileSize)) * canvas.width/2 +
      view.x,
    y -
      ((window.screen.height - canvas.height) / (60 * tileSize)) * canvas.height/2  +
      view.y
  );*/

  /*small map new doesnt work for small screens
  view = {
    x: x - ((window.screen.width - canvas.width) / (numx * tilesizex)) * canvas.width + 2*canvas.width + mapData.width*tileSize,
    y:
      -y +
      ((window.screen.height - canvas.height) / (numy * tilesizey)) * canvas.height +
      2*canvas.height + mapData.height*tileSize,
    w: canvas.width,
    h: canvas.height,
  };

  context.translate(
    -x -
    ((window.screen.width - canvas.width) / (mapData.width * tileSize)) * canvas.width +
    view.x + (canvas.width - mapData.width*tileSize)/2,
    y -
    ((window.screen.height - canvas.height) / (mapData.height * tileSize)) * canvas.height +
    view.y + (canvas.height - mapData.height*tileSize)/2
  );*/

  //view = { x : -x + map[0].length / 2, y: y - map.length / 2}
  //context.translate(view.x,view.y;)

  context.beginPath();
  context.arc(drawX - view.x, drawY - view.y, vision, 0, 2 * Math.PI, false);
  context.clip();

  if (drawState.players[userId].role === "marco") {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  console.log(vision);

  //let gradient = context.createRadialGradient(drawX - view.x, drawY - view.y, 20, drawX - view.x, drawY - view.y, vision);
  //let opacity = 0.20; //55% visible
  //gradient.addColorStop(1,'transparent');
  //gradient.addColorStop(0.005,'rgba(255,255,255,'+opacity+')');
  //fillCircle(context, drawX - view.x, drawY - view.y, vision, gradient);

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

/*
      gid &= ~(FLIPPED_HORIZONTALLY_FLAG |
        FLIPPED_VERTICALLY_FLAG |
        FLIPPED_DIAGONALLY_FLAG);
        //console.log(flipped_horizontally,flipped_vertically,flipped_diagonally);
      if (flipped_horizontally || flipped_vertically || flipped_diagonally) {
        //console.log(flipped_horizontally);
        tpkt = getTile(gid, tilesets, flipped_diagonally,flipped_horizontally,flipped_vertically);
        if (flipped_vertically && flipped_diagonally && flipped_horizontally) {
          context.save();
          context.translate(view.x, view.y);
          context.scale(-1, 1);
          context.rotate(90 * Math.PI / 180); 
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            tilesizey,
            worldX,
            worldY,
            tilesizex,
            tilesizey); 
          context.restore();
        
      } else if (flipped_vertically && flipped_diagonally) { //0x6 270 deg rot
          context.save();
          //context.setTransform(1, 0, 0, 1, tpkt.px, tpkt.py); 
          context.rotate(270 * Math.PI / 180); 
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            tilesizey,
            worldX,
            worldY,
            tilesizex,
            tilesizey); 
          //context.translate(tpkt.px * 32 + pos.X+32, rowSource * 32 + pos.Y);
          //context.rotate(90 * Math.PI / 180);
          context.restore();
        } else if (flipped_horizontally && flipped_diagonally) { //0xA 90 deg rot
          context.save();
          //context.setTransform(1, 0, 0, 1, tpkt.px, tpkt.py); 
          context.rotate(90 * Math.PI / 180); 
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            tilesizey,
            worldX,
            worldY,
            tilesizex,
            tilesizey); 
          //context.translate(tpkt.px * 32 + pos.X+32, rowSource * 32 + pos.Y);
          //context.rotate(90 * Math.PI / 180);
          context.restore();
        } else if (flipped_horizontally && flipped_vertically) { //0xC 180 deg rot
          context.save();
          //context.setTransform(1, 0, 0, 1, tpkt.px, tpkt.py); 
          context.rotate(180 * Math.PI / 180); 
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            tilesizey,
            worldX,
            worldY,
            tilesizex,
            tilesizey); 
          //context.translate(tpkt.px * 32 + pos.X+32, rowSource * 32 + pos.Y);
          //context.rotate(90 * Math.PI / 180);
          context.restore();
        } else if (flipped_horizontally) {
          context.save();
          //context.translate(canvas.width, 0);
          //context.scale(-1, 1);
          
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            tilesizey,
            0,
            0,
            -tilesizex,
            tilesizey); 
            context.translate(worldX, worldY);
          context.restore();
        } /*else if (flipped_vertically) {
          context.save();
          //context.translate(tpkt.px + tilesizex/2, tpkt.py + tilesizey/2);
          context.scale(1, -1);
          //context.translate(view.x, view.y);
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            -tilesizey,
            -worldX,
            -worldY,
            tilesizex,
            -tilesizey); 
          context.restore();
        } else if (flipped_diagonally) {
          context.save();
          
          
          context.translate(tpkt.px + tilesizex/2, tpkt.py + tilesizey/2);
          context.rotate(90 * Math.PI / 180); 
          context.scale(1, -1);
          context.translate(view.x, view.y);
          
          context.drawImage(tpkt.img,
            tpkt.px,
            tpkt.py,
            tilesizex,
            -tilesizey,
            0,
            0,
            tilesizex,
            tilesizey); 
          context.restore();
        }
        else {
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
      } else {
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
//let tpkt = getTile(t_id, tilesets);

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
