import React, { Component } from "react";
import NavBar from "../modules/NavBar/NavBar";
import Chat from "../modules/Chat";

import "./Lobby.css";
import Slider from "@material-ui/core/Slider";

class Lobby extends Component {
  // makes props available in this component
  // props: gameId
  constructor(props) {
    super(props);
    this.state = {
      lobby: {},
    };
  }

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
    // The array follows this schema: [min, default, max, step-size]
    const settings = {
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

    return (
      <div className="lobby-base">
        <div className="lobby-container">
          <NavBar logoutButton={this.props.logoutButton} />
<<<<<<< HEAD
          <div className="lobby-content">
            <div className="lobby-content-header">
              <div className="lobby-content-header-name">Lobby One</div>
              <div className="lobby-content-header-buttoncontainer">
                <div className="lobby-content-header-playercount">10/10</div>
                <button className="lobby-content-header-reset" type="button" onClick={}>
                  Reset Settings
                </button>
              </div>
            </div>
            <div className="lobby-content-settings">
              {Object.keys(settings).map((type, indexFirst) => (
                <>
                  <div className="lobby-content-settings-type" key={"Type " + indexFirst}>
                    {type}
                  </div>
                  {Object.keys(settings[type]).map((setting, index) => (
                    <div
                      className="lobby-content-setting-slidercontainer"
                      key={"SliderCont " + index}
                    >
                      <Slider
                        className="lobby-content-setting-slider"
                        defaultValue={settings[type][setting][1]}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="on"
                        step={settings[type][setting][3]}
                        min={settings[type][setting][0]}
                        max={settings[type][setting][2]}
                        onChange={this.changeCapacity}
                        key={"Slider " + index}
                      />
                      <div key={"SliderName" + index}>{setting}</div>
                    </div>
                  ))}
                </>
              ))}
              <div className="lobby-content-footer">
                <button type="button" className="lobby-content-header-reset lobby-big-button">
                  Save Settings
                </button>
                <div className="lobby-content-footer-gameID">
                  <div>Test-Game-ID</div>
                  <button type="button" className="lobby-content-header-reset lobby-big-button">
                    Copy Game ID
                  </button>
                </div>
              </div>
            </div>
            <Chat />
=======
          <div style={{ color: "white", margin: "300px", width: "800px" }}>
            <h5>Creator: {this.state.lobby.creator}</h5>
            <h5>Game Code: {this.state.lobby.gameId}</h5>
            <h5>Players: {this.state.lobby.numberJoined} / {this.state.lobby.capacity}</h5>
>>>>>>> 39cf9382d5f9f3c32a6437e4a969e47e8a834533
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
