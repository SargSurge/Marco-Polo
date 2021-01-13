import React, { Component } from "react";

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
            <tr>
              <th>Name</th>
              <th>Creator</th>
              <th>Capacity</th>
            </tr>
            <tr>
              {Object.keys(data.lobbies).map((lobby, index) => (
                <>
                  <td>{"Lobby" + index}</td>
                  {console.log(data.lobbies[lobby])}
                  <td>{data.lobbies[lobby].creator}</td>
                  <td>{data.lobbies[lobby].users.length + "/" + data.lobbies[lobby].capacity}</td>
                </>
              ))}
            </tr>
          </table>
        </div>
      </>
    );
  }
}

export default PublicTable;
