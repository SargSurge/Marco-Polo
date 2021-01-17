import React, { Component } from "react";

import "./RoundTable.css";

class RoundTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const players = [];

    let angle = 360 / this.props.numJoined;
    for (let i = 0; i < this.props.numJoined; i++) {
      let y_change =
        Math.sin(
          ((-angle - 360 / this.props.numJoined / (9 / this.props.numJoined)) / 180) * 3.14159
        ) * 40;
      let x_change =
        Math.cos(
          ((-angle - 360 / this.props.numJoined / (9 / this.props.numJoined)) / 180) * 3.14159
        ) * 20;
      let together = `${x_change}px, ${y_change}px`;
      const player = (
        <>
          <div
            className="roundtable-playerBody"
            style={{
              transform: `rotate(${-1 * angle + 360 / this.props.numJoined}deg) translate(240%)`,
            }}
          >
            <div
              style={{
                transform: `rotate(${
                  angle - 360 / this.props.numJoined
                }deg) translate(${together})`,
              }}
            >
              Naseem
            </div>
          </div>
        </>
      );
      players.push(player);
      angle += 360 / this.props.numJoined;
    }

    return (
      <div className="roundtable-base">
        <div className="roundtable-table" id="roundtable-table"></div>
        {players}
      </div>
    );
  }
}

export default RoundTable;
