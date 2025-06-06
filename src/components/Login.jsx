import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded);
      console.log("User Info:", decoded);
    } catch (error) {
      console.error("JWT decode error:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
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
  );
};

export default Login;
