import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NavBar from "../modules/NavBar/NavBar";

import "./Lobby.css";

class Lobby extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="lobby-base">
        <div className="lobby-container">
          <NavBar logoutButton={this.props.logoutButton} />
        </div>
      </div>
    );
  }
}

export default Lobby;
