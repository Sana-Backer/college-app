import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { type: 'assistant', content: "Welcome! I'm here to help you with any questions.", timestamp: getCurrentTime() }
  ]);
  const [inputText, setInputText] = useState('');
  const chatBoxRef = useRef(null);

  // Function to get the current time
  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Function to send user message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: inputText, timestamp: getCurrentTime() }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chatbot/', { userInput: inputText });
      const botResponse = response.data.response;

      setMessages([...newMessages, { type: 'assistant', content: botResponse, timestamp: getCurrentTime() }]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      setMessages([...newMessages, { type: 'assistant', content: "Sorry, I couldn't connect to the server.", timestamp: getCurrentTime() }]);
    }

    setInputText('');
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>AI Assistant</h2>
            <p style={styles.headerSubtitle}>Your College Assistant</p>
          </div>
        </div>

        <div ref={chatBoxRef} style={styles.chatBox}>
          {messages.map((message, index) => (
            <div key={index} style={message.type === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper}>
              <div style={message.type === 'user' ? styles.userMessage : styles.assistantMessage}>
                <p style={message.type === 'user' ? styles.userMessageText : styles.assistantMessageText}>
                  {message.content}
                </p>
                <span style={message.type === 'user' ? styles.userTimestamp : styles.assistantTimestamp}>
                  {message.type === 'user' ? 'You' : 'Assistant'} • {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            style={styles.inputField}
          />
          <button onClick={handleSendMessage} style={styles.sendButton}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for the chat UI
const styles = {
  pageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    marginTop: '1.25rem',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    backgroundColor: 'white',
    width: '900px',
    maxWidth: '100%',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  header: {
    background: '#374151',
    padding: '0.75rem',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '0.75rem',
    color: '#d1d5db',
    marginTop: '0.25rem',
    margin: 0,
  },
  chatBox: {
    padding: '1rem',
    height: '400px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  userMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
  },
  assistantMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '1rem',
  },
  userMessage: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    maxWidth: '80%',
  },
  assistantMessage: {
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    maxWidth: '80%',
    border: '1px solid #e5e7eb',
  },
  inputContainer: {
    borderTop: '1px solid #e5e7eb',
    padding: '0.5rem',
    display: 'flex',
    gap: '0.5rem',
  },
  inputField: {
    flexGrow: 1,
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
  },
  sendButton: {
    background: '#374151',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
  },
};

export default ChatInterface;
