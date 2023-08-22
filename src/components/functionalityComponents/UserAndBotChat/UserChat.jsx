import React, { useState, useEffect, useRef } from "react";

import keycloak from "../../keycloak/keycloak";

function UserAndBotChat({ reciver }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [sessionId, setSessionId] = useState();
  const [isReceiverBot, setIsReceiverBot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const hasRun = useRef(false);

  // Fetch all messages by session ID on component mount and periodically thereafter
  useEffect(() => {
    console.log("hit");
    if (!hasRun.current) {
      console.log("Running useEffect on initial render");
      const init = async () => {
        await getSessionIdIfNotCreate();
        // any other logic you might want to run after that
      };

      init();

      hasRun.current = true;
    }
  }, []);

  useEffect(() => {
    fetchMessages(); // Initial fetch

    const intervalId = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  });

  const fetchMessages = async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/messages/session/${sessionId}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const getSessionIdIfNotCreate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/chatsession/${keycloak.tokenParsed.sub}/${reciver}`
      );
      if (!response.ok) {
        await createSession();
        await getSessionIdIfNotCreate();
      } else {
        const sessID = await response.json();
        setSessionId(sessID.id);
      }
    } catch (error) {
      console.error("Error fetching  session:", error);
    } finally {
      setLoading(false); // Ensure to set loading to false after all operations
    }
  };

  const handleSendMessage = async () => {
    try {
      console.log(sessionId);
      const requestBody = {
        chatSessionId: sessionId,
        userId: keycloak.tokenParsed.sub,
        message: newMessage,
        timeStamp: Date.now().toString(),
      };
      console.log("Sending requestBody : ", requestBody);
      await fetch("http://localhost:8080/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const createSession = async () => {
    try {
      await fetch("http://localhost:8080/api/v1/chatsession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatName: "",
          chatSessionMessages: [],
          participant1: keycloak.tokenParsed.sub,
          participant2: reciver,
          timeStamp: Date.now().toString(),
        }),
      });
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            {/* Display sender if needed */}
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default UserAndBotChat;
