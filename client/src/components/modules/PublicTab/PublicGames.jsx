import React, { Component } from "react";
import JoinGameButton from "../JoinGameButton";
import PublicTable from "./PublicTable";

import "./PublicGames.css";

export class PublicGames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: null,
    };
  }

  changeGameId = (value) => {
    this.setState({
      gameId: value,
    });
  };

  render() {
    return (
      <>
        <div className="publicgames-base">
          <div className="publicgames-table">
            <PublicTable gameId={this.state.gameId} changeGameId={this.changeGameId} />
          </div>
          {/* Lobby List */}
          <JoinGameButton gameId={this.state.gameId} />
        </div>
      </>
    );
  }
}

export default PublicGames;
