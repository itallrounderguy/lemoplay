import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Header from '@components/layout/Header';
import GlobalMenu from '@components/layout/GlobalMenu';
import Preloader from '@components/ui/Preloader';

// Routes
import { getAppRoutes } from '@components/route/AppRoutes';

import '@styles/App.css';


export const UserContext = createContext(null);

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

  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [i18n.language]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Preloader />

      <div className="container">
        {isAuthPage && <Header />}
        {!isAuthPage && user && <GlobalMenu />}

        <Routes>
          {getAppRoutes(user).map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
