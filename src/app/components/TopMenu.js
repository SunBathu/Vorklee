import React from 'react';

function TopMenu({ message }) {
  return (
    <div className="top-message-bar">
      {message && <div className="message success">{message}</div>}
    </div>
  );
}

export default TopMenu;
