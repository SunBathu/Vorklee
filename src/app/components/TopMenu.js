import React from 'react';

function TopMenu({ message, adminEmail, adminEmailPicture }) {
  const [showEmail, setShowEmail] = React.useState(false);

  return (
    <div className="top-menu">
      <div className="top-message-bar">
        {message && <div className="message success">{message}</div>}
      </div>
      <div className="admin-profile">
        <img
          src={adminEmailPicture}
          alt="Admin Profile Picture"
          className="admin-profile-picture"
          onClick={() => setShowEmail(true)}
        />
        {showEmail && (
          <div className="admin-email">
            <p>{adminEmail}</p>
          </div>
        )}
      </div>
    </div>

      <style jsx>{`


      
    .admin-profile {
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.admin-email {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.admin-email p {
  margin: 0;
  padding: 0;
  font-size: 14px;
  color: #333;
}

      `}</style>
    </div>
  );
}

export default TopMenu;
