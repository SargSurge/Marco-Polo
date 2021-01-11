import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

import "./GameType.css";

class GameType extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <NavBar />
      </div>
    );
  }
}

export default GameType;
