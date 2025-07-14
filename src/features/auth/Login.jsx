// components/Login.jsx
import { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  // Inside component
  const { t } = useTranslation();

  // Redirect to the originally intended route or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // Save user in context (App.jsx useEffect handles localStorage)
      setUser(decoded);

      // Navigate after login
      navigate(from, { replace: true });
    } catch (error) {
      console.error('JWT decode error:', error);
    }
  };

  return (
   <div className="login-section">
  <h2>{t('loginPrompt')}</h2>
  <div className="google-btn-wrapper">
    <GoogleLogin
      ux_mode="popup"
      onSuccess={handleLoginSuccess}
      onError={() => console.log("Login Failed")}
    />
  </div>
</div>

  );
};

export default Login;
