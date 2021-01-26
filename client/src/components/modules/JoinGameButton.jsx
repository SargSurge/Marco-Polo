import React, { Component } from "react";
import { post } from "../../utilities";
import { navigate } from "@reach/router";
import { socket } from "../../client-socket";

import "./JoinGameButton.css";

// Props: gameId

export class JoinGameButton extends Component {
  constructor(props) {
    super(props);
  }

  handleJoin = () => {
    post("/api/joingame", { gameId: this.props.gameId })
      .then((res) => {
        if (res.msg === "Invalid") {
          navigate("../");
        }
        if (res.canJoin) {
          navigate(`/lobby/${this.props.gameId}`);
        }
      })
      .catch((err) => console.log(err))
      .then(socket.emit("updateLobbies"))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <button className="joingamebutton-button" type="button" onClick={this.handleJoin}>
          Join Game
        </button>
      </div>
    );
  }
}

export default JoinGameButton;
