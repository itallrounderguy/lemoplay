// App.jsx
import { useState, createContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profiles';
import LanguageLearn from './pages/LanguageLearn';
import MathLearn from './pages/MathLearn';
import LogicLearn from './pages/LogicLearn';
import MemoryGames from './pages/MemoryGames';
import './App.css';

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
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const location = useLocation();
  const showHeader = location.pathname === '/' || location.pathname === '/login';

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="container">
        {showHeader && <Header />}
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />

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

          {/* ✨ New Adventure Routes */}
          <Route
            path="/language_learn"
            element={
              <ProtectedRoute user={user}>
                <LanguageLearn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/math_learn"
            element={
              <ProtectedRoute user={user}>
                <MathLearn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logic_learn"
            element={
              <ProtectedRoute user={user}>
                <LogicLearn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memory_games"
            element={
              <ProtectedRoute user={user}>
                <MemoryGames />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
