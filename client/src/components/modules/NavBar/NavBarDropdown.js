import React, { Component } from "react";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { GoogleLogout } from "react-google-login";

import "./NavBarDropdown.css";
import { Redirect } from "react-router-dom";
import { navigate } from "@reach/router";

const GOOGLE_CLIENT_ID = "478686741541-7mat3uoom72iesonik033gsm2n72pbf3.apps.googleusercontent.com";

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

  componentDidMount() {}

  render() {
    return (
      <div className="navbardropdown-base">
        <div className="navbardropdown-container" onClick={this.handleClick}>
          <ol>
            <li className="menu-item">
              <a
                className="navbardropdown-button"
                style={{ display: "flex", textDecoration: "none" }}
              >
                <div className="navbardropdown-username"> {this.props.user.name} </div>
                <ExpandMoreIcon />
              </a>
              <ol className="sub-menu">
                <li className="menu-item">How to Play</li>
                <li className="menu-item" onClick={() => navigate('/profile')}>Profile</li>
                <li className="menu-item"> {this.props.logoutButton}</li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

export default NavBarDropdown;
