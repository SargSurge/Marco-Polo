import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

import "./Chat.css";

class Chat extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return <div className="chat-base">This is the chat</div>;
  }
}

export default Chat;
