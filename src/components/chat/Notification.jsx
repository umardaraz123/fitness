// components/Notification.jsx
import React, {useEffect } from 'react';

const Notification = ({ notification, onClose }) => {
  const { type, message, id } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span>{message}</span>
        <button onClick={() => onClose(id)}>×</button>
      </div>
    </div>
  );
};

export default Notification;