import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

import "./HomePage.css";

class HomePage extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="homepage-background">
        <div className="homepage-header">
          <span>Marco Polo</span>

        </div>
      </div>
    );
  }
}

export default HomePage;
