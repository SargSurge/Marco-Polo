import React, { Component } from "react";
import GameCanvas from "../modules/GameCanvas";
import { drawCanvas } from "../../canvasManager";

export class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movement: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
      position: {
        x: 0,
        y: 0,
        color: "white",
      },
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    this.gameLoop();
  }

  gameLoop = () => {
    /*
    let timeoutId = setTimeout(() => {
      if (true) {
        this.updatePosition();
        drawCanvas([this.state.position]);
      }
      this.gameLoop();
    }, 1000 / 60);


     */
    requestAnimationFrame(() => {
      this.updatePosition();
      console.log("yes");
      drawCanvas([this.state.position]);
      this.gameLoop();
    });
  };

  handleKeyDown = (event) => {
    //requestAnimationFrame(this.handleKeyDown);
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
    //requestAnimationFrame(this.handleKeyUp);
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
    //requestAnimationFrame(() => {
    let positionUpdate = { x: 0, y: 0 };
    const SPEED = 10;
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
    this.setState({
      position: {
        ...this.state.position,
        x: (this.state.position.x += positionUpdate.x),
        y: (this.state.position.y += positionUpdate.y),
      },
    });
    // });
  }

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
