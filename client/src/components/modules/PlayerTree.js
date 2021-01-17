import React, { Component } from "react";

import "./PlayerTree.css";

class PlayerTree extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.user);
  }

  render() {
    return (
      <div className="playertree-base">
        <ul>
          <li>
            <div
              className={
                this.props.user ? (this.props.user.length >= 1 ? "playertree-loaded" : "") : ""
              }
            >
              {this.props.user
                ? this.props.user.length >= 1
                  ? this.props.user[0].name
                  : "Player"
                : "Player"}
            </div>
            <ul>
              <li>
                <div
                  className={
                    this.props.user ? (this.props.user.length >= 2 ? "playertree-loaded" : "") : ""
                  }
                >
                  {this.props.user
                    ? this.props.user.length >= 2
                      ? this.props.user[1].name
                      : "Player"
                    : "Player"}
                </div>
                <ul>
                  <li>
                    <div
                      className={
                        this.props.user
                          ? this.props.user.length >= 4
                            ? "playertree-loaded"
                            : ""
                          : ""
                      }
                    >
                      {this.props.user
                        ? this.props.user.length >= 4
                          ? this.props.user[3].name
                          : "Player"
                        : "Player"}
                    </div>
                    <ul>
                      <li>
                        <div
                          className={
                            this.props.user
                              ? this.props.user.length >= 6
                                ? "playertree-loaded"
                                : ""
                              : ""
                          }
                        >
                          {this.props.user
                            ? this.props.user.length >= 6
                              ? this.props.user[5].name
                              : "Player"
                            : "Player"}
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div
                      className={
                        this.props.user
                          ? this.props.user.length >= 8
                            ? "playertree-loaded"
                            : ""
                          : ""
                      }
                    >
                      {this.props.user
                        ? this.props.user.length >= 8
                          ? this.props.user[7].name
                          : "Player"
                        : "Player"}
                    </div>
                    <ul>
                      <li>
                        <div
                          className={
                            this.props.user
                              ? this.props.user.length >= 10
                                ? "playertree-loaded"
                                : ""
                              : ""
                          }
                        >
                          {this.props.user
                            ? this.props.user.length >= 10
                              ? this.props.user[9].name
                              : "Player"
                            : "Player"}
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <div
                  className={
                    this.props.user ? (this.props.user.length >= 3 ? "playertree-loaded" : "") : ""
                  }
                >
                  {this.props.user
                    ? this.props.user.length >= 3
                      ? this.props.user[2].name
                      : "Player"
                    : "Player"}
                </div>
                <ul>
                  <li>
                    <div
                      className={
                        this.props.user
                          ? this.props.user.length >= 5
                            ? "playertree-loaded"
                            : ""
                          : ""
                      }
                    >
                      {this.props.user
                        ? this.props.user.length >= 5
                          ? this.props.user[4].name
                          : "Player"
                        : "Player"}
                    </div>
                    <ul>
                      <li>
                        <div
                          className={
                            this.props.user
                              ? this.props.user.length >= 7
                                ? "playertree-loaded"
                                : ""
                              : ""
                          }
                        >
                          {this.props.user
                            ? this.props.user.length >= 7
                              ? this.props.user[6].name
                              : "Player"
                            : "Player"}
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div
                      className={
                        this.props.user
                          ? this.props.user.length >= 9
                            ? "playertree-loaded"
                            : ""
                          : ""
                      }
                    >
                      {this.props.user
                        ? this.props.user.length >= 9
                          ? this.props.user[8].name
                          : "Player"
                        : "Player"}
                    </div>
                    <ul>
                      <li>
                        <div
                          className={
                            this.props.user
                              ? this.props.user.length >= 11
                                ? "playertree-loaded"
                                : ""
                              : ""
                          }
                        >
                          {this.props.user
                            ? this.props.user.length >= 11
                              ? this.props.user[10].name
                              : "Player"
                            : "Player"}
                        </div>
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
