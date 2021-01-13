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
      name: "Username",
      dropdown: "none",
      username: null,
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

  componentDidMount() {
    get("/api/whoami", {}).then((user) => {
      console.log(user);
      this.setState({ name: user.name });
    });
  }

  render() {
    return (
      <div className="navbardropdown-base">
        <div className="navbardropdown-container" onClick={this.handleClick}>
          <div className="navbardropdown-username"> {this.state.name} </div>
          <ExpandMoreIcon />
        </div>
        <div className="navbardropdown-list" style={{ display: this.state.dropdown }}>
          <div className="navbardropdown-list-items">How to Play</div>
          <div className="navbardropdown-list-items">Profile</div>
          <div className="navbardropdown-logout">{this.props.logoutButton}</div>
        </div>
      </div>
    );
  }
}

export default NavBarDropdown;
