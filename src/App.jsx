import { useState, createContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import GlobalMenu from './components/GlobalMenu';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profiles';
import LanguageLearn from './pages/LanguageLearn';
import MathLearn from './pages/MathLearn';
import LogicLearn from './pages/LogicLearn';
import MemoryGames from './pages/MemoryGames';
import Preloader from './components/Preloader'; // ✅ Preloader imported
import AdventuresSubTypes from './components/AdventuresSubTypes'; // 👈 Import it
import { useTranslation } from 'react-i18next';

import './App.css';

export const UserContext = createContext(null);

const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
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
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';


  const { i18n } = useTranslation();

  // ⬇️ Add RTL support here
  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.body.dir = direction; // Optional: also affect body
  }, [i18n.language]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {/* ✅ Preloader mounted globally, outside routing logic */}
      <Preloader />

      <div className="container">
        {isAuthPage && <Header />}
        {!isAuthPage && user && <GlobalMenu />}

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
          <Route
            path="/memory_subtypes"
            element={
              <ProtectedRoute user={user}>
                <AdventuresSubTypes />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
