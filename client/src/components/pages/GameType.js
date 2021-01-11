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
        <div className="gametype-navbar-container">
          <NavBar />
        </div>
<<<<<<< HEAD
        <div className="gametype-content">HELLLO</div>
=======
        <div><GameTabs /></div>
        <div>HELLLO</div>
>>>>>>> a1692a479604e2a36f0ebfd15abcb9c188743ac9
      </div>
    );
  }
}

export default GameType;
