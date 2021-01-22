import React, { Component } from "react";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import './MatchTable.css';

export class MatchTable extends Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

// props: matches

  render() {
    return (
      <>
        <div>
          <table>
            <thead>
              <tr className="publictable-headers">
                <th style={{ width: "50%" }}>Name</th>
                <th style={{ width: "30%" }}>Creator</th>
                <th style={{ width: "20%", textAlign: "center" }}>W / L</th>
              </tr>
            </thead>
            <tbody>
              {this.props.matches.map((match, index) => (
                <tr
                  className={`publictable-table-row ${
                    this.props.gameId === match.gameId ? "publictable-table-row-active" : ""
                  }`}
                  key={index}
                >
                  <td style={{ width: "50%" }}>{match.name}</td>
                  <td style={{ width: "30%" }}>{match.creator}</td>
                  <td style={{ width: "20%", textAlign: "center" }}>
                    {match.win ? 'W' : 'L'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default MatchTable;
