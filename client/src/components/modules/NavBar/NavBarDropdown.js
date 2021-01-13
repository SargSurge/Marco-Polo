import React, { Component } from "react";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { GoogleLogout } from "react-google-login";

import "./NavBarDropdown.css";
import { Redirect } from "react-router-dom";

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
          <GoogleLogout 
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={() => console.log()}
            onFailure={(err) => console.log(err)}
            render={renderProps => (
                <a className="navbardropdown-list-items navbardropdown-logout" href='http://localhost:5000'>Logout</a> 
            )}
            ></GoogleLogout>
        </div>
      </div>
    );
  }
}

export default NavBarDropdown;
