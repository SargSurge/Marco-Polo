import React, { Component } from "react";
import { socket } from "../../client-socket";
import { drawCanvas } from "../../canvasManager";

export class GameCanvas extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.processUpdate(this.props.update);
  }

  componentDidUpdate() {
    this.processUpdate(this.props.update);
  }

  processUpdate = (update) => {
    //requestAnimationFrame(() => {
    drawCanvas(update);
    // });
  };

  render() {
    return (
      <div>
        <canvas id="game-canvas" width="800px" height="800px" />
      </div>
    );
  }
}

export default GameCanvas;
