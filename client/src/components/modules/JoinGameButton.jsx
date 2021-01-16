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
    post("/api/joingame", { gameId: this.props.gameId }).then((res) => {
      alert(res.msg);
      if (res.canJoin) {
        navigate(`/lobby/${this.props.gameId}`);
      }
    }).then(socket.emit("updateLobbies"));
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
