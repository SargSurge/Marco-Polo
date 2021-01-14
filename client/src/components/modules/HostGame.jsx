import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import { post } from "../../utilities";

import "./HostGame.css";

// marks for material-ui slider
// currently disabled, can enable in props of slider
// marks = {marks}
const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 10,
    label: "10",
  },
];

export class HostGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      capacity: 3,
      public: false,
    };
  }

  inputName = (event) => {
    this.setState({ name: event.target.value });
  };

  changeCapacity = (event, value) => {
    this.setState({ capacity: value });
  };

  togglePrivacy = () => {
    this.setState({ public: !this.state.public });
  };

  hostGame = () => {
    post("/api/hostgame", {
      name: this.state.name,
      capacity: this.state.capacity,
      public: this.state.public,
    }).then((res) => console.log("you just hosted a game with id: " + res.gameId));
  };

  render() {
    return (
      <div className="hostgame-base">
        <form className="hostgame-form">
          <input
            className="hostgame-form-input"
            type="text"
            value={this.state.name}
            placeholder="Game Name"
            onChange={this.inputName}
          />
          <div className="hostgame-form-checkbox-container">
            <h5 style={{ color: "white" }}>Public?</h5>
            <input
              className="hostgame-form-checkbox"
              type="checkbox"
              onChange={this.togglePrivacy}
            />
          </div>
        </form>
        <div className="hostgame-capacity">Capacity</div>
        <Slider
          className="hostgame-slider"
          defaultValue={3}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="on"
          step={1}
          marks
          min={3}
          max={10}
          onChange={this.changeCapacity}
        />
        <button className="hostgame-button" onClick={this.hostGame}>
          Host Game
        </button>
      </div>
    );
  }
}

export default HostGame;
