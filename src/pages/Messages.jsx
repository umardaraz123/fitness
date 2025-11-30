import React from 'react';
import ChatModule from '../components/ChatModule';
import ChatInterface from '../components/chat/ChatInterface';

const Messages = () => {
  return (
    <div className="messages-page">
      {/* <ChatModule /> */}
      <ChatInterface />
    </div>
  );
};

export default Messages;