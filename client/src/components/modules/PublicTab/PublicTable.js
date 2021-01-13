import React, { Component } from "react";
import { get, post } from "../../../utilities";

import "./PublicTable.css";

export class PublicTable extends Component {
  constructor(props) {
    super(props);
    this.state = { lobbies: {} };
  }

  componentDidMount() {
    get("/api/lobbies", {}).then((lobbies) => {
      this.setState({ lobbies: lobbies });
    });
  }

  render() {
    return (
      <>
        <div>
          <table>
            <tr className="publictable-headers">
              <th style={{ width: "50%" }}>Name</th>
              <th style={{ width: "30%" }}>Creator</th>
              <th style={{ width: "20%", textAlign: "center" }}>Capacity</th>
            </tr>
            {Object.keys(this.state.lobbies).map((lobby, index) => (
              <tr
                className={`publictable-table-row ${
                  this.props.gameId === this.state.lobbies[lobby].id
                    ? "publictable-table-row-active"
                    : ""
                }`}
                key={index}
                onClick={() => this.props.changeGameId(this.state.lobbies[lobby].id)}
              >
                <td style={{ width: "50%" }}>{"Lobby" + (index + 1)}</td>
                <td style={{ width: "30%" }}>{this.state.lobbies[lobby].creator}</td>
                <td style={{ width: "20%", textAlign: "center" }}>
                  {this.state.lobbies[lobby].users.length +
                    "/" +
                    this.state.lobbies[lobby].capacity}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </>
    );
  }
}

export default PublicTable;
