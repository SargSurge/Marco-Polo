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
    this.state = {
      user: undefined,
    };
  }

  leaveGame = (user) => {
    console.log(user);
    post("/api/leavegame", {user: user}).then(() => navigate("/"));
  }

  componentDidMount() {
    get('/api/whoami', {}).then((user) => {
      this.setState({user: user});
    })
  }

  render() {
    return (
      <div className="navbar-base">
        <div className="navbar-header" onClick={() => this.leaveGame(this.user)}>
          {" "}
          Marco Polo{" "}
        </div>
        {this.state.user ? <NavBarDropdown user={this.state.user} logoutButton={this.props.logoutButton} /> : ""}
      </div>
    );
  }
}

export default NavBar;
