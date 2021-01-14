import React, { Component } from "react";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import { navigate } from "@reach/router";

import "./NavBar.css";
import NavBarDropdown from "./NavBarDropdown";

class NavBar extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="navbar-base">
        <div className="navbar-header" onClick={() => navigate("/")}>
          {" "}
          Marco Polo{" "}
        </div>
        <NavBarDropdown logoutButton={this.props.logoutButton} />
      </div>
    );
  }
}

export default NavBar;
