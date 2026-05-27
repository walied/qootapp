import React from 'react';
import { C } from '../constants';

const ChatMessage = ({ message, lang }) => {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '16px', padding: '0 16px' }}>
      <div style={{ maxWidth: '70%', background: isUser ? C.teal : C.card, color: isUser ? '#fff' : C.text, padding: '12px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '14px', lineHeight: '1.5' }}>
        {message.image && <img src={message.image} alt="uploaded" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '8px' }} />}
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.7, textAlign: isUser ? 'right' : 'left' }}>
          {new Date(message.created_at).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
