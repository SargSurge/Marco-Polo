import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NavBar from "../modules/NavBar/NavBar";

import "./Lobby.css";

class Lobby extends Component {
  // makes props available in this component
  // props: gameId
  constructor(props) {
    super(props);
    this.state = {
      lobby: {},
    };
  }

  componentDidMount() {
    get("/api/lobby", { gameId: this.props.gameId })
      .then((res) => {
        this.setState({
          lobby: res.lobby,
        });
      })
      .then(() => console.log(this.state.lobby));
  }

  render() {
    return (
      <div className="lobby-base">
        <div className="lobby-container">
          <NavBar logoutButton={this.props.logoutButton} />
          <div style={{ color: "white", margin: "300px", width: "800px" }}>
            <h5>Creator: {this.state.lobby.creator}</h5>
            <h5>Game Code: {this.state.lobby.gameId}</h5>
            <h5>Players: {this.state.lobby.numberJoined} / {this.state.lobby.capacity}</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
