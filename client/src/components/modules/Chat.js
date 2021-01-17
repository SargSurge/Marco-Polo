import React, { Component } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

import "./Chat.css";

class Chat extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {messages : []};
  }

  componentDidMount() {
    this.loadChat();
    socket.on("new_message", (new_message) => {
        this.setState({ messages: this.state.messages.concat(new_message) });
        });
      }
      

  loadChat() {
    get("/api/chat", { gameId : this.props.gameId }).then((new_messages) => {
      this.setState({ messages: new_messages });
      });
  }

  componentWillUnmount() {
    socket.off("new_message");
  }

  // called when the user hits "Submit" for a new post
  handleSubmit = (new_text) => {
    post("/api/message", {gameId : this.props.gameId, content : new_text});
  };

  render() {
    return (
      <div className="u-flex">
        <div >
            {this.state.messages}
          </div>
        <input
          type="text"
        />
        <button
          type="submit"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Chat;
