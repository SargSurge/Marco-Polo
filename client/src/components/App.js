import React, { Component } from "react";
import { Router, navigate } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import GameType from "./pages/GameType";

import "bootstrap/dist/css/bootstrap.min.css";
import Lobby from "./pages/Lobby";
import GoogleLogin, { GoogleLogout } from "react-google-login";

/**
 * Define the "App" component as a class.
 */

const GOOGLE_CLIENT_ID = "478686741541-7mat3uoom72iesonik033gsm2n72pbf3.apps.googleusercontent.com";

class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      user: undefined,
    };
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        this.setState({ userId: user._id });
        post("/api/initsocket", { socketid: socket.id });
      })
      .catch((err) => console.log(err));
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
    console.log("logging out");
    socket.emit("logout");
    navigate("/");
  };

  componentDidMount() {
    get("/api/whoami")
      .then((user) => {
        if (user._id) {
          // they are registed in the database, and currently logged in.
          this.setState({ userId: user._id, user: user });
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    const logoutButton = (
      <GoogleLogout
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={this.handleLogout}
        onFailure={(err) => console.log(err)}
        render={(renderProps) => (
          <a
            onClick={renderProps.onClick}
            className="navbardropdown-list-items navbardropdown-logout"
          >
            Logout
          </a>
        )}
      />
    );

    const loginButton = (
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={this.handleLogin}
        onFailure={(err) => console.log(err)}
        render={(renderProps) => (
          <>
            <a
              id="login-button"
              className="homepage-button"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Press any Key to Login
            </a>
          </>
        )}
      />
    );

    return (
      <>
        <Router>
          <HomePage
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
            loginButton={loginButton}
            logoutButton={logoutButton}
          />
          <Lobby path="/lobby/:gameId" userId={this.state.userId} logoutButton={logoutButton} />
          <GamePage path="/game/:gameId" user={this.state.user} />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
