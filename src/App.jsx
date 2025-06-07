// App.jsx
import { useState, createContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import './App.css'; // ✅ THIS LINE IS ESSENTIAL


// Context to share user info globally
export const UserContext = createContext(null);



// Route protection wrapper
const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  return user
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};



const App = () => {
  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });




  // When user changes, update localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);






  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="container">
        <Header />
        <Routes>
          {/* Default route: send to dashboard if logged in, else login */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Public login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
