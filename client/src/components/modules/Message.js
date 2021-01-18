import React, { Component } from "react";

class Message extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <span>{this.props.message.sender.name + ":"}</span>
        <span>{this.props.message.content}</span>
      </div>
    );
  }
}

export default Message;
