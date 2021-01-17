import React, { Component } from "react";

import "./PlayerTree.css";

class PlayerTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    };
  }

  componentDidMount() {}

  render() {
    const players = [];

    this.props.users.forEach((user) => {});

    return (
      <div className="playertree-base">
        <ul>
          <li>
            <div className="playertree-loaded">Naseem</div>
            <ul>
              <li>
                <div className="playertree-loaded">Naseem</div>
                <ul>
                  <li>
                    <div>Naseem</div>
                    <ul>
                      <li>
                        <div>Naseem</div>
                      </li>
                      <li>
                        <div className="playertree-loaded">Naseem</div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div>Naseem</div>
                  </li>
                </ul>
              </li>
              <li>
                <div>Naseem</div>
                <ul>
                  <li>
                    <div>Naseem</div>
                  </li>
                  <li>
                    <div>Naseem</div>
                    <ul>
                      <li>
                        <div>Naseem</div>
                      </li>
                      <li>
                        <div>Naseem</div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default PlayerTree;
