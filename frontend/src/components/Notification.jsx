import React, { useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi'; 

function Notification({ message, onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, 3000); 

    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    // Position the notification at the top-center of the screen
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
      <div className="flex items-center gap-4 bg-green-500 text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-lg">
        <FiCheckCircle className="text-xl" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Notification;