import React, { Component } from "react";
import { socket } from "../../client-socket";
import { get, post } from "../../utilities";
import GameCanvas from "../modules/GameCanvas";
import { move } from "../../client-socket";
import { collisionManager, drawAllPlayers, drawCanvas, init } from "../../canvasManager";
import A2 from "./assets/Inside_A2.png";
import A4 from "./assets/Inside_A4.png";
import A5 from "./assets/Inside_A5.png";
import B from "./assets/Inside_B.png";
import C from "./assets/Inside_C.png";
//import Gate from "./assets/!$Gate1.png";
import Timer from "react-compound-timer";
import "./GamePage.css";
import { navigate } from "@reach/router";

let loadCount;
let json = require("./assets/MediumMapFinished.json");
let tilesets = [];
let numx = json.width;
let numy = json.height;
let tilesizex = json.tilewidth;
let tilesizey = json.tileheight;
let tileset_imgs = [A2, A2, A4, A5, B, C];

export class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      movement: {
        up: false,
        down: false,
        right: false,
        left: false,
      },
      position: {
        x: 0,
        y: 0,
      },
      powerup: {
        name: "Light Bomb",
        cooldown: 10000,
        ready: true,
      },
      tag: {
        name: "Tag",
        cooldown: 30000,
        ready: true,
      },
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    loadCount = 0;
    for (let i = 0; i < json.tilesets.length; i++) {
      let img = new Image();
      img.onload = function () {
        loadCount++;
      };
      img.src = tileset_imgs[i];
      let tileset = {
        firstgid: json.tilesets[i].firstgid,
        image: img,
        imagewidth: json.tilesets[i].imagewidth,
        imageheight: json.tilesets[i].imageheight,
        numx: Math.floor(json.tilesets[i].imagewidth / tilesizex),
        numy: Math.floor(json.tilesets[i].imageheight / tilesizey),
      };
      tilesets.push(tileset);
    }

    get("/api/whoami", {}).then((user) => {
      get("/api/initialRender", { gameId: this.props.gameId }).then((res) => {
        let currState = res.initialRender;
        if (loadCount == json.tilesets.length) {
          this.processUpdate(currState, user);
        }
        let isMarco = currState.players[user._id].role == "marco";
        this.setState(
          {
            user: user,
            gameState: currState,
            finalTime: currState.finalTime,
            isMarco: isMarco,
            powerup: {
              name: isMarco ? "Thermal Radar" : "Instant Transmission",
              cooldown: isMarco
                ? currState.settings.marcoRadar * 1000
                : currState.settings.poloTP * 1000,
              ready: true,
            },
            tag: {
              name: "Tag",
              cooldown: currState.settings.marcoTimer * 1000,
              ready: true,
            },
          },
          () => {
            if (loadCount == json.tilesets.length) {
              this.gameLoop(currState, user);
            }
            socket.on("update", (gameState) => {
              this.setState({ gameState: gameState });
            });
          }
        );
      });
    });
  }

  gameLoop = (gamestate, user) => {
    requestAnimationFrame(() => {
      let tempState = this.state.gameState || gamestate;
      let tempUser = this.state.user || user;

      if (tempState.finalTime - new Date().getTime() <= 0) {
        //navigate("/");
      }
      this.updatePosition();
      tempState.players[tempUser._id].position = this.state.position;
      this.move(tempUser);
      drawCanvas(tempState, tempUser._id, tilesets, false);
      this.gameLoop(gamestate, user);
    });
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    socket.off("update");
  }

  handleKeyDown = (event) => {
    switch (event.code) {
      case "KeyA": // A
        this.setState({ movement: { ...this.state.movement, left: true } });
        break;
      case "KeyW": // W
        this.setState({ movement: { ...this.state.movement, up: true } });
        break;
      case "KeyD": // D
        this.setState({ movement: { ...this.state.movement, right: true } });
        break;
      case "KeyS": // S
        this.setState({ movement: { ...this.state.movement, down: true } });
        break;
    }
  };

  handleKeyUp = (event) => {
    switch (event.code) {
      case "KeyA": // A
        this.setState({ movement: { ...this.state.movement, left: false } });
        break;
      case "KeyW": // W
        this.setState({ movement: { ...this.state.movement, up: false } });
        break;
      case "KeyD": // D
        this.setState({ movement: { ...this.state.movement, right: false } });
        break;
      case "KeyS": // S
        this.setState({ movement: { ...this.state.movement, down: false } });
        break;
    }
  };

  updatePosition() {
    let positionUpdate = { x: 0, y: 0 };
    const SPEED = 7;
    const dirMap = {
      up: ["y", 1],
      down: ["y", -1],
      right: ["x", 1],
      left: ["x", -1],
    };
    Object.keys(this.state.movement).map((dir, index) => {
      if (this.state.movement[dir]) {
        positionUpdate[dirMap[dir][0]] += SPEED * dirMap[dir][1];
      }
    });

    let newX = this.state.position.x;
    let newY = this.state.position.y;

    if (positionUpdate.x == 0 && positionUpdate.y == 0) {
      return;
    } else if (positionUpdate.x == 0 && positionUpdate.y !== 0) {
      newY = collisionManager(true, this.state.position.x, this.state.position.y, positionUpdate.y);
    } else if (positionUpdate.x !== 0 && positionUpdate.y == 0) {
      newX = collisionManager(
        false,
        this.state.position.x,
        this.state.position.y,
        positionUpdate.x
      );
    } else {
      newX = collisionManager(
        false,
        this.state.position.x,
        this.state.position.y,
        positionUpdate.x
      );
      newY = collisionManager(true, this.state.position.x, this.state.position.y, positionUpdate.y);
    }

    this.setState({
      position: {
        ...this.state.position,
        x: (this.state.position.x = newX),
        y: (this.state.position.y = newY),
      },
    });
  }

  move = (user) => {
    //render movement for me
    move(user._id, this.props.gameId, this.state.position);
  };

  processUpdate = (gameState, user) => {
    drawCanvas(gameState, user._id, tilesets, true);
  };

  handleTeleport = () => {
    let largeMapCoords = [
      { x: 266, y: 434 },
      { x: 21, y: 791 },
      { x: -175, y: -364 },
      { x: 308, y: -147 },
      { x: 287, y: -623 },
      { x: 610, y: 455 },
      { x: 883, y: 805 },
      { x: 771, y: -300 },
      { x: -222, y: 378 },
      { x: -643, y: 714 },
      { x: -880, y: 455 },
      { x: -782, y: -888 },
      { x: 43, y: -853 },
      { x: 694, y: 266 },
      { x: 43, y: -202 },
    ];
    let smallMapCoords = [];
    if (this.state.gameState.settings.mapSize === 2) {
      let newPos = largeMapCoords[Math.floor(Math.random() * largeMapCoords.length)];
      this.setState({
        position: newPos,
      });
    } else if (this.state.gameState.mapSize === 1) {
    }
  };

  handlePowerUp = (powerup) => {
    if (powerup === "Instant Transmission") {
      this.handleTeleport();
    } else if (powerup === "Thermal Radar") {
    }
  };

  render() {
    return (
      <div className="gamepage-base">
        <div className="gamepage-game-container">
          <button
            className="gamepage-ui-button gamepage-leavegame-button"
            onClick={() => {
              post("/api/leaveGameState", {gameId: this.props.gameId}).then(() => {
                navigate("/");
              });
            }}

          >
            Leave Game
          </button>
          <div className="gamepage-header">Welcome to Marco Polo!</div>
          {this.state.gameState ? (
            <div className="gamepage-timer">
              {Math.floor((this.state.gameState.finalTime - new Date().getTime()) / 1000 / 60)} :
              {Math.floor(((this.state.gameState.finalTime - new Date().getTime()) / 1000) % 60) >=
              10
                ? " "
                : " 0"}
              {Math.floor(((this.state.gameState.finalTime - new Date().getTime()) / 1000) % 60)}
            </div>
          ) : (
            ""
          )}

          <div className="gamepage-character-header">
            You're a {this.state.isMarco ? "Marco!" : "Polo!"}
          </div>
          <div className="gamepage-canvas-container">
            <canvas id="map-layer" width={window.innerWidth} height={window.innerHeight}></canvas>
          </div>
          <Timer
            initialTime={this.state.powerup.cooldown}
            startImmediately={false}
            direction="backward"
            onStart={() => console.log("onStart hook")}
            onResume={() => console.log("onResume hook")}
            onReset={() => console.log("onReset hook")}
          >
            {({ start, resume, reset, getTime }) => (
              <button
                className="gamepage-ui-button gamepage-powerup-button"
                onClick={() => {
                  if (this.state.powerup.ready) {
                    start();
                    this.handlePowerUp(this.state.powerup.name);
                    this.setState({ powerup: { ...this.state.powerup, ready: false } });
                  }
                }}
              >
                {this.state.powerup.ready ? (
                  this.state.powerup.name
                ) : getTime() <= 0 ? (
                  (this.setState({ powerup: { ...this.state.powerup, ready: true } }),
                  reset(),
                  resume())
                ) : (
                  <Timer.Seconds />
                )}
              </button>
            )}
          </Timer>
          {this.state.isMarco ? (
            <Timer
              initialTime={this.state.tag.cooldown}
              startImmediately={false}
              direction="backward"
              onStart={() => console.log("onStart hook")}
              onResume={() => console.log("onResume hook")}
              onReset={() => console.log("onReset hook")}
            >
              {({ start, resume, reset, getTime }) => (
                <button
                  className="gamepage-ui-button gamepage-tag-button"
                  onClick={() => {
                    if (this.state.tag.ready) {
                      start();
                      this.setState({ tag: { ...this.state.tag, ready: false } });
                    }
                  }}
                >
                  {this.state.tag.ready ? (
                    this.state.tag.name
                  ) : getTime() <= 0 ? (
                    (this.setState({ tag: { ...this.state.tag, ready: true } }), reset(), resume())
                  ) : (
                    <Timer.Seconds />
                  )}
                </button>
              )}
            </Timer>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default GamePage;
