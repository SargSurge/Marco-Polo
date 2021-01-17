import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import SvgComponent from "./assets/flashlightHomeSVGComponent.js";
import "./HomePage.css";
import GameType from "./GameType";

class HomePage extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.addEventListener('keypress', this.clickLogin)
  }

  clickLogin = () => {
    document.getElementById("login-button").click();
    window.removeEventListener('keypress', this.clickLogin)

  }

  render() {
    const homePage = (
      <div className="homepage-background">
        <div className="homepage-header">
          <span className="homepage-header-text">Marco Polo</span>
          <div className="homepage-circle-inner"></div>
          <div className="homepage-circle-outer"></div>
          <div className="homepage-circle-outer-outer"></div>

          {this.props.loginButton}
        </div>
      </div>
    );

    return (
      <>
        {this.props.userId ? (
          <>
            <GameType logoutButton={this.props.logoutButton}/>
          </>
        ) : (
          homePage
        )}
      </>
    );
  }
}

export default HomePage;
