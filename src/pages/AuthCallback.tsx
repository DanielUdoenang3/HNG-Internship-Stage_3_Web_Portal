import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Validate state parameter to prevent CSRF
      if (!state) {
        navigate(`/login?error=invalid_state`, { replace: true });
        return;
      }

      // Handle errors from GitHub
      if (error) {
        navigate(`/login?error=auth_failed`, { replace: true });
        return;
      }

      // Check for required parameters
      if (!code) {
        navigate(`/login?error=no_code`, { replace: true });
        return;
      }

      // The backend handles the token exchange and sets HTTP-only cookies
      // We just need to refresh the user state
      try {
        await refreshUser();
        
        // Redirect to dashboard on success
        navigate('/dashboard', { replace: true });
      } catch {
        navigate(`/login?error=token_error`, { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;
