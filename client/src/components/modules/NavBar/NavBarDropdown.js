import React, { Component } from "react";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./NavBarDropdown.css";

class NavBarDropdown extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      dropdown: "none",
    };
  }

  handleClick = () => {
    if (this.state.dropdown === "none") {
      this.setState({
        dropdown: "block",
      });
    } else {
      this.setState({
        dropdown: "none",
      });
    }
  };

  componentDidMount() {}

  render() {
    return (
      <div className="navbardropdown-base">
        <div className="navbardropdown-container" onClick={this.handleClick}>
          <div className="navbardropdown-username"> Naseem Hamed </div>
          <ExpandMoreIcon />
        </div>
        <div className="navbardropdown-list" style={{ display: this.state.dropdown }}>
          <div className="navbardropdown-list-items">How to Play</div>
          <div className="navbardropdown-list-items">Profile</div>
          <div className="navbardropdown-list-items">Sign Out</div>
        </div>
      </div>
    );
  }
}

export default NavBarDropdown;
