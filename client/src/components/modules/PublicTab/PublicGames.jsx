import React, { Component } from "react";
import JoinGameButton from "../JoinGameButton";
import PublicTable from "./PublicTable";

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
        <div>
          <PublicTable />
          {/* Lobby List */}
          <JoinGameButton gameId={this.state.gameId} />
        </div>
      </>
    );
  }
}

export default PublicGames;
