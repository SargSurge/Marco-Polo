import React, { Component } from "react";
import NavBar from "../modules/NavBar/NavBar";
import Chat from "../modules/Chat";
import { get, post } from "../../utilities";
import "./Lobby.css";
import { socket, startGame } from "../../client-socket";
import { navigate } from "@reach/router";
import Slider from "@material-ui/core/Slider";
import PlayerTree from "../modules/PlayerTree";

class Lobby extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);

    // The array follows this schema: [min, default, max, step-size]
    this.settings = {
      "General Settings": { "Time Limit": [2, 6, 10, 1], "Map Size": [1, 2, 2, 1] },
      "Marco Settings": {
        "Vision Radius": [100, 100, 500, 5],
        "Illuminate Timer": [10, 40, 80, 5],
        "Tag Timer": [10, 20, 50, 5],
      },
      "Polo Settings": {
        "Vision Radius": [100, 250, 500, 5],
        "Warp Timer": [0, 40, 80, 5],
      },
    };

    this.state = {
      user: undefined,
      lobby: {},
      sliders: this.resetSettings(),
    };
  }

  resetSettings = () => {
    let tempSliderState = {};
    Object.keys(this.settings).map((type) => {
      Object.keys(this.settings[type]).map((setting, index) => {
        tempSliderState[type + setting + index] = this.settings[type][setting][1];
      });
    });
    return tempSliderState;
  };

  updateLobby = () => {
    get("/api/lobby", { gameId: this.props.gameId })
      .then((res) => {
        if (res.lobby) {
          this.setState({
            lobby: res.lobby,
          });
          if (!res.lobby.players.some((p) => p._id === this.state.user._id)) {
            post("/api/joingame", { gameId: this.props.gameId }).catch((e) => console.log(e));
          }
        } else {
          post("/api/leavegame", { user: this.state.user });
          //navigate("/");
        }
      })
      .catch((err) => {
        console.log(`${err}`);
        //navigate("/");
      });
  };

  updateLobbySettings = (lobby) => {
    if (this.state.lobby.players && !(this.state.user._id === this.state.lobby.players[0]._id)) {
      this.setState({
        sliders: lobby.settings,
        lobby: lobby,
      });
    }
  };

  componentDidMount() {
    get("/api/whoami", {})
      .then((user) => {
        this.setState({ user: user });
      })
      .then(() => this.updateLobby());

    socket.on("updateLobbiesAll", () => {
      this.updateLobby();
    });
    socket.on("updateLobbySettings", (lobby) => {
      this.updateLobbySettings(lobby);
    });
    socket.once("startGame", (gameId) => {
      alert("Starting the game!");
      navigate(`../game/${this.state.lobby.gameId}`);
    });
  }

  componentDidUpdate() {
    if (!this.state.user) {
      get("/api/whoami", {})
      .then((user) => {
        this.setState({ user: user });
      });
    }
  }

  componentWillUnmount() {
    socket.off("updateLobbiesAll");
    socket.off("updateLobbySettings");
  }

  render() {
    return (
      <div className="lobby-base">
        <div className="lobby-container">
          <NavBar logoutButton={this.props.logoutButton} />
          <div className="lobby-content-container">
            <div className="lobby-content-left">
              <div className="lobby-content-left-header">
                <div className="lobby-content-left-header-name">{this.state.lobby.name}</div>
                <div className="lobby-content-left-header-buttoncontainer">
                  <div className="lobby-content-left-header-playercount">
                    {this.state.lobby.numberJoined} / {this.state.lobby.capacity}
                  </div>
                  <button
                    className="lobby-content-left-header-reset"
                    type="button"
                    disabled={
                      this.state.lobby.players
                        ? !(this.state.user._id === this.state.lobby.players[0]._id)
                        : true
                    }
                    onClick={() => {
                      this.setState({ sliders: this.resetSettings() });
                      post("/api/updateLobbySettings", {
                        gameId: this.props.gameId,
                        settings: this.resetSettings(),
                      });
                    }}
                  >
                    Reset Settings
                  </button>
                </div>
              </div>
              <div className="lobby-content-left-settings">
                {Object.keys(this.settings).map((type, indexFirst) => (
                  <>
                    <div className="lobby-content-left-settings-type" key={"Type " + indexFirst}>
                      {type}
                    </div>
                    {Object.keys(this.settings[type]).map((setting, index) => (
                      <div
                        className="lobby-content-left-setting-slidercontainer"
                        key={"SliderCont " + index}
                      >
                        <Slider
                          disabled={
                            this.state.lobby.players
                              ? !(this.state.user._id === this.state.lobby.players[0]._id)
                              : false
                          }
                          className={
                            (
                              this.state.lobby.players
                                ? !(this.state.user._id === this.state.lobby.players[0]._id)
                                : false
                            )
                              ? "lobby-content-left-setting-slider-disabled"
                              : "lobby-content-left-setting-slider"
                          }
                          value={this.state.sliders[type + setting + index]}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="on"
                          type="range"
                          step={this.settings[type][setting][3]}
                          min={this.settings[type][setting][0]}
                          max={this.settings[type][setting][2]}
                          onChange={(event, value) => {
                            let tempSliders = { ...this.state.sliders };
                            tempSliders[type + setting + index] = value;
                            this.setState({ sliders: tempSliders });
                            if (
                              this.state.user &&
                              this.state.lobby.players &&
                              this.state.user._id === this.state.lobby.players[0]._id
                            ) {
                              post("/api/updateLobbySettings", {
                                gameId: this.props.gameId,
                                settings: tempSliders,
                              });
                            }
                          }}
                          key={type + setting + index}
                        />
                        <div className="lobby-content-left-setting-name" key={"SliderName" + index}>
                          {setting}
                        </div>
                      </div>
                    ))}
                  </>
                ))}
                <div className="lobby-content-left-footer">
                  <button
                    type="button"
                    className="lobby-content-left-header-reset lobby-big-button"
                    onClick={() => {
                      navigator.clipboard.writeText(this.state.lobby.gameId);
                    }}
                  >
                    Copy Game ID
                  </button>
                  <button
                    type="button"
                    className="lobby-content-left-header-reset lobby-big-button"
                    disabled={
                      this.state.lobby.players
                        ? !(this.state.user._id === this.state.lobby.players[0]._id)
                        : true
                    }
                    onClick={() => {
                      post("/api/startGame", { gameId: this.state.lobby.gameId }).then(() => {
                        startGame(this.state.lobby.gameId);
                      });
                    }}
                  >
                    Start Game
                  </button>
                  <div>{this.state.lobby.gameId}</div>
                </div>
              </div>
            </div>
            <div className="lobby-content-right">
              <div className="lobby-content-right-header">Usable Test Subjects</div>
              {this.state.lobby.capacity ? (
                <PlayerTree user={this.state.lobby.players} capacity={this.state.lobby.capacity} />
              ) : (
                ""
              )}
              <Chat gameId={this.props.gameId} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
