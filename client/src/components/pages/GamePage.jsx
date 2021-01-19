import React, { Component } from "react";
import { socket } from "../../client-socket";
import { get, post } from "../../utilities";
import GameCanvas from "../modules/GameCanvas";
import { move } from "../../client-socket";
import { drawCanvas } from "../../canvasManager";

export class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      activeKeys: {
        up: false,
        down: false,
        right: false,
        left: false,
      },
    };
  }

  componentDidMount() {
    get("/api/whoami", {}).then((user) => {
      this.setState({ user: user });
    });

    get("/api/initialRender", { gameId: this.props.gameId }).then((res) => {
      this.processUpdate(res.initialRender);
    });

    window.addEventListener("keydown", this.handleInput);
    socket.on("update", (gameState) => {
      this.processUpdate(gameState);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleInput);
    socket.off("update");
  }

  handleInput = (event) => {
    switch (event.code) {
      case "KeyA": // A
        this.move("left");
        break;
      case "KeyW": // W
        this.move("up");
        break;
      case "KeyD": // D
        this.move("right");
        break;
      case "KeyS": // S
        this.move("down");
        break;
    }
  };

  move = (dir) => {
    //render movement for me
    move(this.state.user._id, this.props.gameId, dir);
  };

  processUpdate = (gameState) => {
    drawCanvas(gameState);
  };

  render() {
    return (
      <>
        <div>
          <canvas id="game-canvas" width="800px" height="800px" />
        </div>
      </>
    );
  }
}

export default GamePage;
