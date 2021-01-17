import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import { post } from "../../utilities";
import { socket } from "../../client-socket";

import "./HostGame.css";
import { navigate } from "@reach/router";

// marks for material-ui slider
// currently disabled, can enable in props of slider
// marks = {marks}

const settings = {
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

    this.marks = [
      {
        value: 3,
        label: 3,
      },
      {
        value: 4,
        label: 4,
      },
      {
        value: 5,
        label: 5,
      },
      {
        value: 6,
        label: 6,
      },
      {
        value: 7,
        label: 7,
      },
      {
        value: 8,
        label: 8,
      },
      {
        value: 9,
        label: 9,
      },
      {
        value: 10,
        label: 10,
      },
    ];
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
    if (this.state.name !== null && this.state.name.trim().length !== 0) {
      post("/api/hostgame", {
        name: this.state.name,
        capacity: this.state.capacity,
        public: this.state.public,
        settings: settings,
      })
        .then((res) => {
          if (res.msg == "Invalid") {
            navigate('../');
          } else if (res.msg) {
            alert(res.msg);
          } else {
            alert("You just hosted a game with id: " + res.gameId);
            navigate(`/lobby/${res.gameId}`);
          }
        })
        .then(socket.emit("updateLobbies"))
        .catch((err) => console.log(err));
    } else {
      alert("Enter a game id idiot");
    }
  };

  render() {
    return (
      <div className="hostgame-base">
        <form className="hostgame-form">
          <input
            className="hostgame-form-input"
            type="text"
            value={this.state.name ? this.state.name : ""}
            placeholder="Game Name"
            onChange={this.inputName}
            maxlength="25"
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
          marks={this.marks}
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
