import React, { useEffect, useRef } from "react";
import Message from "./Message";

const MessageBox = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      {typeof messages !== "undefined"
        ? messages.map((m, i) => <Message message={m} key={"message" + i} />)
        : ""}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageBox;
