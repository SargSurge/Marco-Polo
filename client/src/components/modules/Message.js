import React, { Component } from "react";

import "./Message.css";

class Message extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="message-base">
        <span className="message-sender">{this.props.message.sender.name + ":"}</span>
        <span>{this.props.message.content}</span>
      </div>
    );
  }
}

export default Message;
