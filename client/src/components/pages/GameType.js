import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NavBar from "../modules/NavBar/NavBar";
import TabBar from "../modules/TabBar";

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
        <div className="gametype-navbar-container">
          <NavBar />
        </div>
        <div><TabBar /></div>
        <div>HELLLO</div>
      </div>
    );
  }
}

export default GameType;
