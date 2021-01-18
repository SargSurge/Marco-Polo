import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import Message from "./Message.js";

import "./Chat.css";

class Chat extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = { messages: [], value: "" };
  }

  componentDidMount() {
    this.loadChat();
    socket.on("new_message", (new_message) => {
      this.setState({ messages: this.state.messages.concat(new_message) });
    });
  }

  loadChat() {
    get("/api/chat", { gameId: this.props.gameId }).then((res) => {
      this.setState({ messages: res });
    });
  }

  componentWillUnmount() {
    socket.off("new_message");
  }

  // called when the user hits "Submit" for a new post
  handleSubmit = () => {
    post("/api/message", { gameId: this.props.gameId, content: this.state.value });
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div className="chat-base">
        <div>
          {this.state.messages.map((m, i) => (
            <Message message={m} key={i} />
          ))}
        </div>
        <div>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <button type="submit" value="Submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;
