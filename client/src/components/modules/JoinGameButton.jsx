import React, { Component } from "react";
import { post } from "../../utilities";

import "./JoinGameButton.css";

// Props: gameId

export class JoinGameButton extends Component {
  constructor(props) {
    super(props);
  }

  handleJoin = () => {
    // Join this.props.gameId
    post("/api/joingame", { gameId: this.props.gameId }).then((res) => {
      alert("You joined room " + res.gameId);
    })
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
