import React, { Component } from "react";
import NavBar from "../modules/NavBar/NavBar";
import Chat from "../modules/Chat";
import { get, post } from "../../utilities";
import RoundTable from "../modules/RoundTable";
import "./Lobby.css";
import Slider from "@material-ui/core/Slider";
import { socket } from "../../client-socket";

class Lobby extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);

    // The array follows this schema: [min, default, max, step-size]
    this.settings = {
      "General Settings": { "Time Limit": [2, 5, 10, 1], "Map Size": [1, 1, 3, 1] },
      "Marco Settings": {
        "Vision Radius": [0, 50, 100, 5],
        "Light Bomb Timer": [0, 15, 30, 5],
        "Tag Reach": [0, 50, 100, 5],
      },
      "Polo Settings": {
        "Vision Radius": [0, 50, 100, 5],
        "Teleport Bomb Timer": [0, 50, 100, 5],
      },
    };

    this.state = {
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
        this.setState({
          lobby: res.lobby,
        });
      })
      .catch((err) => console.log("${err}"));
  }

  updateLobbySettings = (lobby) => {
    this.setState({
        sliders: lobby.settings,
      });
  }

  componentDidMount() {
    this.updateLobby();
    socket.on("updateLobbiesAll", () => {
      this.updateLobby();
    });
    socket.on("updateLobbySettings", (lobby) => {
      this.updateLobbySettings(lobby);
      console.log(lobby);
    });
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
                    onClick={() => {
                      this.setState({ sliders: this.resetSettings() });
                      post("/api/updateLobbySettings", { gameId : this.props.gameId, settings: this.resetSettings() });
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
                          className="lobby-content-left-setting-slider"
                          value={this.state.sliders[type + setting + index]}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="on"
                          step={this.settings[type][setting][3]}
                          min={this.settings[type][setting][0]}
                          max={this.settings[type][setting][2]}
                          onChange={(event, value) => {
                            let tempSliders = { ...this.state.sliders };
                            tempSliders[type + setting + index] = value;
                            this.setState({ sliders: tempSliders });
                            post("/api/updateLobbySettings", { gameId : this.props.gameId, settings: tempSliders});
                          }}
                          key={type + setting + index}
                        />
                        <div key={"SliderName" + index}>{setting}</div>
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
                  <div>{this.state.lobby.gameId}</div>
                </div>
              </div>
            </div>
            <div className="lobby-content-right">
              <RoundTable numJoined={10} />
              <Chat />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
