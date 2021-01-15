import React, { Component } from "react";
import NavBar from "../modules/NavBar/NavBar";
import Chat from "../modules/Chat";
import { get } from "../../utilities";

import "./Lobby.css";
import Slider from "@material-ui/core/Slider";

class Lobby extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);

    // The array follows this schema: [min, default, max, step-size]
    this.settings = {
      "General Settings": { "Time Limit": [2, 5, 10, 1], "Map Size": [1, 1, 3, 1] },
      "Marco Settings": {
        "Vision Radius": [0, 50, 100, 5],
        "Light Bomb Cooldown": [0, 15, 30, 5],
        "Tag Reach": [0, 50, 100, 5],
      },
      "Polo Settings": {
        "Vision Radius": [0, 50, 100, 5],
        "Teleport Bomb Cooldown": [0, 50, 100, 5],
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

  componentDidMount() {
    get("/api/lobby", { gameId: this.props.gameId })
      .then((res) => {
        this.setState({
          lobby: res.lobby,
        });
      })
      .then(() => console.log(this.state.lobby));
  }

  render() {
    return (
      <div className="lobby-base">
        <div className="lobby-container">
          <NavBar logoutButton={this.props.logoutButton} />
          <div className="lobby-content">
            <div className="lobby-content-header">
              <div className="lobby-content-header-name">{this.state.lobby.name}</div>
              <div className="lobby-content-header-buttoncontainer">
                <div className="lobby-content-header-playercount">
                  {this.state.lobby.numberJoined} / {this.state.lobby.capacity}
                </div>
                <button
                  className="lobby-content-header-reset"
                  type="button"
                  onClick={() => {
                    this.setState({ sliders: this.resetSettings() });
                  }}
                >
                  Reset Settings
                </button>
              </div>
            </div>
            <div className="lobby-content-settings">
              {Object.keys(this.settings).map((type, indexFirst) => (
                <>
                  <div className="lobby-content-settings-type" key={"Type " + indexFirst}>
                    {type}
                  </div>
                  {Object.keys(this.settings[type]).map((setting, index) => (
                    <div
                      className="lobby-content-setting-slidercontainer"
                      key={"SliderCont " + index}
                    >
                      <Slider
                        className="lobby-content-setting-slider"
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
                        }}
                        key={type + setting + index}
                      />
                      <div key={"SliderName" + index}>{setting}</div>
                    </div>
                  ))}
                </>
              ))}
              <div className="lobby-content-footer">
                <button
                  type="button"
                  className="lobby-content-header-reset lobby-big-button"
                  onClick={() => {
                    navigator.clipboard.writeText(this.state.lobby.gameId);
                  }}
                >
                  Copy Game ID
                </button>
                <div>{this.state.lobby.gameId}</div>
              </div>
            </div>
            <Chat />
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
