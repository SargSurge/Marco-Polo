import React, { Component } from "react";

import "./PublicTable.css";

export class PublicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = {
      lobbies: {
        lobby1: {
          creator: "Surge",
          capacity: 5,
          users: ["Naseem"],
        },
        lobby2: {
          creator: "Naseem",
          capacity: 7,
          users: ["Naseem", "Naseem", "Naseem"],
        },
        lobby3: {
          creator: "Sabi",
          capacity: 5,
          users: ["Naseem", "Naseem"],
        },
        lobby4: {
          creator: "Entropy",
          capacity: 5,
          users: ["Naseem", "Naseem", "Naseem", "Naseem", "Naseem", "Naseem", "Naseem"],
        },
      },
    };

    return (
      <>
        <div>
          <table>
            <tr className="publictable-headers">
              <th style={{ width: "50%" }}>Name</th>
              <th style={{ width: "30%" }}>Creator</th>
              <th style={{ width: "20%", textAlign: "center" }}>Capacity</th>
            </tr>
            {Object.keys(data.lobbies).map((lobby, index) => (
              <tr>
                <td style={{ width: "50%" }}>{"Lobby" + (index + 1)}</td>
                {console.log(data.lobbies[lobby])}
                <td style={{ width: "30%" }}>{data.lobbies[lobby].creator}</td>
                <td style={{ width: "20%", textAlign: "center" }}>
                  {data.lobbies[lobby].users.length + "/" + data.lobbies[lobby].capacity}
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
