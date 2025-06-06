// App.jsx
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';

import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded); // You get name, email, picture here
      console.log("User Info:", decoded);
    } catch (error) {
      console.error("JWT decode error:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo-wrapper">
          <iframe
            src="https://learnify2025.s3.us-east-1.amazonaws.com/logo/logo.html"
            width="256"
            height="256"
            className="logo-iframe"
            title="Lemo"
            scrolling="no"
            allowTransparency="true"
          ></iframe>
        </h1>
      </div>

      <div className="login-section">
        {!user ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        ) : (
          <div className="user-info">
            <p>Welcome, {user.name}</p>
            <img src={user.picture} alt="Profile" width="80" height="80" />
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
