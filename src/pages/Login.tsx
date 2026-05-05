import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Github, BrainCircuit, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  // Handle OAuth callback success
  useEffect(() => {
    const handleCallback = async () => {
      // Check if we're returning from OAuth
      const code = searchParams.get('code');
      
      if (code) {
        // The backend should have set cookies, refresh user data
        await refreshUser();
      }
    };

    handleCallback();
  }, [searchParams, refreshUser]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <BrainCircuit size={32} />
          </div>
        </div>

        <h1 className="login-title">Welcome to Insighta Labs+</h1>
        <p className="login-subtitle">
          Sign in to access the Profile Intelligence System
        </p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>
              {error === 'auth_failed' && 'Authentication failed. Please try again.'}
              {error === 'no_code' && 'Authorization code not received.'}
              {error === 'token_error' && 'Failed to obtain access token.'}
              {error === 'user_error' && 'Failed to retrieve user information.'}
              {!['auth_failed', 'no_code', 'token_error', 'user_error'].includes(error) && 'An error occurred during authentication.'}
            </span>
          </div>
        )}

        <button onClick={login} className="github-btn">
          <Github size={20} />
          <span>Continue with GitHub</span>
        </button>

        <div className="login-footer">
          <p>Secure access powered by OAuth 2.0 with PKCE</p>
          <p style={{ marginTop: '0.5rem' }}>
            HTTP-only cookies • CSRF protection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
