import React, { Component } from "react";
import { socket, tagPlayer } from "../../client-socket";
import { get, post } from "../../utilities";
import GameCanvas from "../modules/GameCanvas";
import { move } from "../../client-socket";
import { collisionManager, drawAllPlayers, drawCanvas } from "../../canvasManager";
import A2 from "./assets/Inside_A2.png";
import A4 from "./assets/Inside_A4.png";
import A5 from "./assets/Inside_A5.png";
import B from "./assets/Inside_B.png";
import C from "./assets/Inside_C.png";
import "./GamePage.css";
import { navigate } from "@reach/router";
import Timer from "react-compound-timer";

let loadCount;
let json = require("./assets/MediumMapFinished.json");
let tilesets = [];
let numx = json.width;
let numy = json.height;
let tilesizex = json.tilewidth;
let tilesizey = json.tileheight;
let tileset_imgs = [A2, A2, A4, A5, B, C];
let thermal = { active: false, time: null };

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
        name: "Null",
        cooldown: 10000,
        ready: true,
      },
      tag: {
        name: "Tag  [Space]",
        cooldown: 30000,
        ready: true,
      },
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("keypress", this.handleKeyPress);

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

    try {
      get("/api/whoami", {}).then((user) => {
        get("/api/initialRender", { gameId: this.props.gameId }).then((res) => {
          let currState = res.initialRender;
          if (loadCount == json.tilesets.length) {
            this.processUpdate(currState, user);
          }
          try {
            let isMarco = currState.players[user._id].role == "marco";
            let currMarco = null;
            for (let player in currState.players) {
              if (!currState.players.hasOwnProperty(player)) continue;
              if (currState.players[player].role === "marco") {
                currMarco = currState.players[player].user.name;
                break;
              }
            }
          } catch (error) {
            
          }
          
          this.setState(
            {
              user: user,
              gameState: currState,
              finalTime: currState.finalTime,
              isMarco: isMarco,
              marco: currMarco,
              powerup: {
                name: isMarco ? "Illuminate  [E]" : "Warp  [Space]",
                cooldown: isMarco
                  ? currState.settings.marcoRadar * 1000
                  : currState.settings.poloTP * 1000,
                ready: true,
              },
              tag: {
                name: "Tag [Space]",
                cooldown: currState.settings.marcoTimer * 1000,
                ready: true,
              },
            },
            () => {
              if (loadCount == json.tilesets.length) {
                this.gameLoop(currState, user);
              }
              socket.on("update", (gameState) => {
                if (typeof gameState.tagged !== "undefined") {
                  this.setState({ gameState: gameState });
                } else {
                  console.log(gameState);
                }
              });
            }
          );
        });
      });
    } catch (e) {
      console.log(e);
      navigate("/");
      window.location.reload();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((new Date().getTime() - thermal.time) / 1000 >= 5) {
      thermal = { active: false, time: new Date().getTime() };
    }
    if (!prevState.user) {
      get("/api/whoami", {})
        .then((user) => {
          this.setState({
            user: user,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  gameLoop = (gamestate, user) => {
    window.requestAnimationFrame(() => {
      let tempState = this.state.gameState || gamestate;
      let tempUser = this.state.user || user;
      try {
        this.updatePosition();
        tempState.players[tempUser._id].position = this.state.position;
        this.move(tempUser);
        drawCanvas(tempState, tempUser._id, tilesets, false, thermal);
        this.gameLoop(tempState, tempUser);
      } catch (e) {
        this.gameLoop(tempState, tempUser);
      }
    });
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("keypress", this.handleKeyPress);
    socket.off("update");
  }

  handleKeyDown = (event) => {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA": // A
        this.setState({ movement: { ...this.state.movement, left: true } });
        break;
      case "ArrowUp":
      case "KeyW": // W
        this.setState({ movement: { ...this.state.movement, up: true } });
        break;
      case "ArrowRight":
      case "KeyD": // D
        this.setState({ movement: { ...this.state.movement, right: true } });
        break;
      case "ArrowDown":
      case "KeyS": // S
        this.setState({ movement: { ...this.state.movement, down: true } });
        break;
    }
  };

  handleKeyUp = (event) => {
    switch (event.code) {
      case "ArrowLeft":
      case "KeyA": // A
        this.setState({ movement: { ...this.state.movement, left: false } });
        break;
      case "ArrowUp":
      case "KeyW": // W
        this.setState({ movement: { ...this.state.movement, up: false } });
        break;
      case "ArrowRight":
      case "KeyD": // D
        this.setState({ movement: { ...this.state.movement, right: false } });
        break;
      case "ArrowDown":
      case "KeyS": // S
        this.setState({ movement: { ...this.state.movement, down: false } });
        break;
    }
  };

  handleKeyPress = (event) => {
    switch (event.code) {
      case "KeyE":
        if (this.state.isMarco) {
          this.clickPowerUp();
        }
        break;
      case "Space":
        if (this.state.isMarco) {
          this.clickTag();
        } else {
          this.clickPowerUp();
        }
    }
  }

  updatePosition() {
    let positionUpdate = { x: 0, y: 0 };
    const SPEED = this.state.isMarco ? 7 : 5;
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
    let smallMapCoords = [
      { x: -49, y: -189 },
      { x: -483, y: -517.97 },
      { x: -455, y: 280.03 },
      { x: 364, y: 581.03 },
      { x: 637, y: -376.94000000000096 },
      { x: 504.03999999999996, y: 120.05999999999904 },
      { x: -538.94, y: 43.07999999999902 },
      { x: 126.05999999999995, y: 281.079999999999 },
      { x: -258.7600000000002, y: 596.4199999999989 },
      { x: 273.2399999999998, y: -495.5700000000011 },
      { x: -160.76000000000022, y: -439.5700000000011 },
    ];
    if (gameState.settings.mapSize === 2) {
      let newPos = largeMapCoords[Object.keys(gameState.players).indexOf(user._id)];
      this.setState({
        position: newPos,
      });
    } else if (gameState.settings.mapSize === 1) {
      let newPos = smallMapCoords[Object.keys(gameState.players).indexOf(user._id)];
      this.setState({
        position: newPos,
      });
    }
    drawCanvas(gameState, user._id, tilesets, true, thermal);
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
    let smallMapCoords = [
      { x: -49, y: -189 },
      { x: -483, y: -517.97 },
      { x: -455, y: 280.03 },
      { x: 364, y: 581.03 },
      { x: 637, y: -376.94000000000096 },
      { x: 504.03999999999996, y: 120.05999999999904 },
      { x: -538.94, y: 43.07999999999902 },
      { x: 126.05999999999995, y: 281.079999999999 },
      { x: -258.7600000000002, y: 596.4199999999989 },
      { x: 273.2399999999998, y: -495.5700000000011 },
      { x: -160.76000000000022, y: -439.5700000000011 },
    ];
    if (this.state.gameState.settings.mapSize === 2) {
      let newPos = largeMapCoords[Math.floor(Math.random() * largeMapCoords.length)];
      this.setState({
        position: newPos,
      });
    } else if (this.state.gameState.settings.mapSize === 1) {
      let newPos = smallMapCoords[Math.floor(Math.random() * smallMapCoords.length)];
      this.setState({
        position: newPos,
      });
    }
  };

  handlePowerUp = (powerup) => {
    if (powerup === "Warp  [Space]") {
      this.handleTeleport();
    } else if (powerup === "Illuminate  [E]") {
      thermal = { active: true, time: new Date().getTime() };
    }
  };

  clickPowerUp = () => {
    try {
      document.getElementById("power-up-button").click();
    } catch(e) {}
  }

  clickTag = () => {
    try {
      document.getElementById("tag-button").click();
    } catch(e) {}
  }

  render() {
    if (this.state.gameState && this.state.gameState.players) {
      let canTag = false;
      let tagClass = "gamepage-ui-button gamepage-tag-button gamepage-tag-disabled";
      let taggedPlayer = null;
      if (this.state.isMarco) {
        for (let player in this.state.gameState.players) {
          if (!this.state.gameState.players.hasOwnProperty(player)) continue;
          if (
            this.state.user._id !== player &&
            this.state.gameState.players[player].active &&
            Math.sqrt(
              Math.pow(this.state.gameState.players[player].position.x - this.state.position.x, 2) +
                Math.pow(this.state.gameState.players[player].position.y - this.state.position.y, 2)
            ) <= 100
          ) {
            canTag = true;
            tagClass = "gamepage-ui-button gamepage-tag-button";
            taggedPlayer = player;
            break;
          }
        }
      }

      let winner = null;
      if (this.state.gameState.finalTime - new Date().getTime() <= 0) {
        winner = "polo";
      }

      if (
        this.state.gameState.poloCaught ===
        Object.keys(this.state.gameState.players).length - 1
      ) {
        winner = "marco";
      }
      if (Object.keys(this.state.gameState.players).length in [1, 2]) {
        winner = null;
      }

      if (winner) {
        let headerClass = null;
        let buttonClass = null;
        if (winner === "marco") {
          headerClass = "gamepage-header-marco gamepage-end-container";
          buttonClass =
            "gamepage-button-marco gamepage-ui-button-end gamepage-leavegame-button-end";
        } else {
          headerClass = "gamepage-header-polo gamepage-end-container";
          buttonClass = "gamepage-button-polo gamepage-ui-button-end gamepage-leavegame-button-end";
        }
        return (
          <div className="gamepage-base-end">
            <div className={headerClass}>
              <div className="gamepage-end-header">Congrats to the {winner}</div>
              <button
                id="leavegame"
                className={buttonClass}
                onClick={() => {
                  post("/api/leaveGameState", { gameId: this.props.gameId, winner: winner })
                    .then(() => {
                      navigate("/");
                      window.location.reload();
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
              >
                Leave Game
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="gamepage-base">
            <div className="gamepage-game-container">
              <button
                id="leavegame"
                className="gamepage-ui-button gamepage-leavegame-button"
                onClick={() => {
                  post("/api/leaveGameState", { gameId: this.props.gameId, winner: null })
                    .then(() => {
                      navigate("/");
                      window.location.reload();
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
              >
                Leave Game
              </button>
              <div className="gamepage-currentMarco">{this.state.marco} is Marco</div>
              <div className="gamepage-character-header">
                You're a{" "}
                {this.state.isMarco
                  ? "Marco!"
                  : this.state.gameState.players[this.state.user._id].active
                  ? "Polo!"
                  : "Ghost!"}
              </div>
              <div className="gamepage-charactar-counter">
                Polo's Left:{" "}
                {Object.keys(this.state.gameState.players).length -
                  1 -
                  this.state.gameState.poloCaught}
              </div>
              <div className="gamepage-timer">
                {Math.floor((this.state.gameState.finalTime - new Date().getTime()) / 1000 / 60)} :
                {Math.floor(
                  ((this.state.gameState.finalTime - new Date().getTime()) / 1000) % 60
                ) >= 10
                  ? " "
                  : " 0"}
                {Math.floor(((this.state.gameState.finalTime - new Date().getTime()) / 1000) % 60)}
              </div>
              <div className="gamepage-character-header">
                You're a{" "}
                {this.state.isMarco
                  ? "Marco!"
                  : this.state.gameState.players[this.state.user._id].active
                  ? "Polo!"
                  : "Ghost!"}
              </div>
              <div className="gamepage-canvas-container">
                <canvas
                  id="map-layer"
                  width={window.innerWidth}
                  height={window.innerHeight}
                ></canvas>
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
                    id="power-up-button"
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
                      id="tag-button"
                      className={tagClass}
                      onClick={() => {
                        if (this.state.tag.ready) {
                          if (canTag) {
                            tagPlayer(
                              this.props.gameId,
                              this.state.gameState.players[taggedPlayer]
                            );
                            start();
                            this.setState({ tag: { ...this.state.tag, ready: false } });
                          }
                        }
                      }}
                    >
                      {this.state.tag.ready ? (
                        this.state.tag.name
                      ) : getTime() <= 0 ? (
                        (this.setState({ tag: { ...this.state.tag, ready: true } }),
                        reset(),
                        resume())
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
    } else {
      return <div></div>;
    }
  }
}

export default GamePage;