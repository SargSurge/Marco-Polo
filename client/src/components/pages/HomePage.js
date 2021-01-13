import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import SvgComponent from "./assets/flashlightHomeSVGComponent.js";
import "./HomePage.css";
import GameType from "./GameType";
import GoogleLogin, { GoogleLogout } from "react-google-login";

const GOOGLE_CLIENT_ID = "478686741541-7mat3uoom72iesonik033gsm2n72pbf3.apps.googleusercontent.com";

class HomePage extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const logoutButton = (
      <GoogleLogout
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={this.props.handleLogout}
        onFailure={(err) => console.log(err)}
        className="homepage-logout"
      />
    );

    const homePage = (
      <div className="homepage-background">
        <div className="homepage-header">
          <span className="homepage-header-text">Marco Polo</span>
          <div className="homepage-circle-inner"></div>
          <div className="homepage-circle-outer"></div>
          <div className="homepage-circle-outer-outer"></div>
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
            render={renderProps => (
              <a className="homepage-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>Login</a>
            )}
          />
        </div>
      </div>
    );

    return (
      <>
        {this.props.userId ? (
          <>
            <GameType logoutButton={logoutButton} />
          </>
        ) : (
          homePage
        )}
      </>

      // <div className="homepage-background">
      //   <div className="homepage-header">
      //     <span className="homepage-header-text">Marco Polo</span>
      //     {this.props.userId ? (
      //       <GoogleLogout
      //         clientId={GOOGLE_CLIENT_ID}
      //         buttonText="Logout"
      //         onLogoutSuccess={this.props.handleLogout}
      //         onFailure={(err) => console.log(err)}
      //         className="homepage-button"
      //       />
      //     ) : (
      //       <GoogleLogin
      //         clientId={GOOGLE_CLIENT_ID}
      //         buttonText="Login"
      //         onSuccess={this.props.handleLogin}
      //         onFailure={(err) => console.log(err)}
      //         className="homepage-button"
      //       />
      //     )}
      //   </div>
      // </div>
    );
  }
}

export default HomePage;
