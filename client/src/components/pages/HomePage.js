import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import SvgComponent from "./assets/flashlightHomeSVGComponent.js";
import "./HomePage.css";
import GoogleLogin, { GoogleLogout } from "react-google-login";

const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class HomePage extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="homepage-background">
        <div className="homepage-header">
          <span className="homepage-header-text">Marco Polo</span>
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="homepage-button"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="homepage-button"
            />
          )}
        </div>
      </div>
    );
  }
}

export default HomePage;
