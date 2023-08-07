import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";

const Chat = (props) => {
  const id = props.id.toString();
  const [clientRef, setClientRef] = useState(null);
  const [messages, setMessages] = useState([]);

  const onMessageReceive = (msg, topic) => {
    console.log("Received message:", msg, "from topic:", topic);
    console.log(msg); // Log the received message
    setMessages((prevMessages) => [...prevMessages, msg]);
  };

  const sendMessage = (msg, recipient) => {
    const chatMSG = {
      senderId: recipient,
      message: msg,
      timeStamp: Date.now().toString(),
    };
    const url = `/app/chat.sendTo/${recipient}`;
    console.log(
      "Sending message to URL:",
      url,
      "with payload:",
      JSON.stringify(chatMSG)
    );
    console.log("Sending message to recipient:", recipient); // Log the recipient ID
    clientRef.sendMessage(
      `/app/chat.sendTo/${recipient}`,
      JSON.stringify(chatMSG)
    );
  };

  return (
    <div>
      <SockJsClient
        url="http://localhost:8080/websocket-chat"
        topics={[`/${id}/queue/messages`]}
        onConnect={() => console.log("Connected!")}
        onDisconnect={() => console.log("Disconnected!")}
        onMessage={onMessageReceive}
        ref={(client) => {
          setClientRef(client);
        }}
      />

      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg.message}</p>
        ))}
      </div>

      <button
        onClick={() => {
          console.log(id);
          sendMessage("Hello", id);
        }}
      >
        Send Message
      </button>
    </div>
  );
};

export default Chat;
