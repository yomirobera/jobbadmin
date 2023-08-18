import React, { useState, useEffect } from 'react';

function UserAndBotChat({ sessionId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionIdVar, setSessionIdVar] = useState(sessionId)

    // Fetch all messages by session ID on component mount and periodically thereafter
    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/messages/session/${sessionId}`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [sessionId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            try {
                await fetch('http://localhost:8080/api/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chatSessionId: sessionId,
                        message: newMessage,
                        // Add other required fields here
                    }),
                });
                setNewMessage('');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map(message => (
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
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default UserAndBotChat;