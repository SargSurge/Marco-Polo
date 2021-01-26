import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

// Tab Components
import PublicGames from "./PublicTab/PublicGames";
import PrivateGame from "./PrivateGame";
import HostGame from "./HostGame";

import "./GameTabs.css";

export class GameTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  componentDidMount() {
    window.location.reload();
  }

  render() {
    return (
      <div className="gametabs-base">
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <h1
                  className="gametabs-tab"
                  style={{ color: this.state.activeTab === "1" ? "black" : "white" }}
                >
                  Public
                </h1>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <h1
                  className="gametabs-tab"
                  style={{ color: this.state.activeTab === "2" ? "black" : "white" }}
                >
                  Private
                </h1>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "3" })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                <h1
                  className="gametabs-tab"
                  style={{ color: this.state.activeTab === "3" ? "black" : "white" }}
                >
                  Host
                </h1>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="gametabs-tabcontent">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <PublicGames />
            </TabPane>
            <TabPane tabId="2">
              <PrivateGame />
            </TabPane>
            <TabPane tabId="3">
              <HostGame />
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

export default GameTabs;
