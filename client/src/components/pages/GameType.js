import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NavBar from "../modules/NavBar/NavBar";
import GameTabs from "../modules/GameTabs";

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
      <div className="gametype-base">
        <div className="gametype-container">
          <NavBar logoutButton={this.props.logoutButton} />
          <GameTabs />
        </div>
      </div>
    );
  }
}

export default GameType;
