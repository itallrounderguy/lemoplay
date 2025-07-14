// src/routes/AppRoutes.jsx

import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@components/route/ProtectedRoute';

// Feature pages
import Login from '@features/auth/Login';
import Profile from '@features/profile/Profiles';
import AdventuresSubTypes from '@features/adventures/AdventuresSubTypes';
import Dashboard from '@features/dashboard/Dashboard';
import LanguageLearn from '@features/languageLearn/LanguageLearn';
import MathLearn from '@features/mathLearn/MathLearn';
import LogicLearn from '@features/logicLearn/LogicLearn';
import MemoryGames from '@features/memoryGames/MemoryGames';

// Helper to wrap routes that require auth
const createProtectedRoute = (user, element) => (
  <ProtectedRoute user={user}>{element}</ProtectedRoute>
);

// Main route definitions
export const getAppRoutes = (user) => [
  {
    path: '/',
    element: user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: createProtectedRoute(user, <Dashboard />),
  },
  {
    path: '/profile',
    element: createProtectedRoute(user, <Profile />),
  },
  {
    path: '/language_learn',
    element: createProtectedRoute(user, <LanguageLearn />),
  },
  {
    path: '/math_learn',
    element: createProtectedRoute(user, <MathLearn />),
  },
  {
    path: '/logic_learn',
    element: createProtectedRoute(user, <LogicLearn />),
  },
  {
    path: '/memory_games',
    element: createProtectedRoute(user, <MemoryGames />),
  },
  {
    path: '/memory_subtypes',
    element: createProtectedRoute(user, <AdventuresSubTypes />),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
