import React, { Component } from "react";
import JoinGameButton from "./JoinGameButton";

import "./PrivateGame.css";

export class PrivateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: null,
    };
  }

  inputGameId = (event) => {
    this.setState({ gameId: event.target.value });
  };

  handleSubmit = (event) => {};

  render() {
    return (
      <div className="privategame-base">
        <div className="privategame-header">Enter a Game ID Below:</div>
        <form onSubmit={this.handleSubmit}>
          <input
            className="privategame-input"
            type="text"
            value={this.state.gameId}
            placeholder="#1234"
            onChange={this.inputGameId}
          />
        </form>
        <JoinGameButton gameId={this.state.gameId} />
      </div>
    );
  }
}

export default PrivateGame;
