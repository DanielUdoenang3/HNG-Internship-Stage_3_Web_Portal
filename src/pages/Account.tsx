import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Github
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const { user } = useAuth();
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  if (!user) {
    return (
      <div className="page-content">
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>User information not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Account</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Profile Information</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img 
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff&size=128`}
                alt={user.username}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  border: '3px solid var(--color-primary)'
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  @{user.username}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge badge-${user.role === 'admin' ? 'green' : 'blue'}`} style={{ textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                  {user.is_active ? (
                    <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={12} />
                      Active
                    </span>
                  ) : (
                    <span className="badge badge-red">Inactive</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="detail-item">
                <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Github size={14} />
                  GitHub ID
                </div>
                <div className="detail-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                  {user.github_id}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} />
                  Username
                </div>
                <div className="detail-value">{user.username}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} />
                  Email
                </div>
                <div className="detail-value">
                  {user.email || <span className="text-muted">Not provided</span>}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} />
                  Member Since
                </div>
                <div className="detail-value">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>

              {user.last_login_at && (
                <div className="detail-item">
                  <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} />
                    Last Login
                  </div>
                  <div className="detail-value">
                    {new Date(user.last_login_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Security</h2>
          </div>
          <div className="card-body">
            <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
              <Shield size={18} />
              <div>
                <strong>Secure Authentication</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                  Your session is secured with HTTP-only cookies and CSRF protection.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="detail-item">
                <div className="detail-label">Authentication Method</div>
                <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Github size={16} />
                  GitHub OAuth 2.0 with PKCE
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Access Token</div>
                <div className="detail-value">
                  <span className="badge badge-green">Active</span>
                  <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    Expires every 3 minutes, auto-refreshed
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Session Security</div>
                <div className="detail-value">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                    HTTP-only cookies
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                    CSRF protection
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={() => setShowTokenInfo(!showTokenInfo)}
            >
              {showTokenInfo ? 'Hide' : 'Show'} Token Information
            </button>

            {showTokenInfo && (
              <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                <AlertCircle size={18} />
                <div>
                  <strong>Token Lifecycle</strong>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                    <li>Access tokens expire after 3 minutes</li>
                    <li>Refresh tokens expire after 5 minutes</li>
                    <li>Tokens are stored in HTTP-only cookies</li>
                    <li>Each refresh invalidates the old refresh token</li>
                    <li>Frontend receives new token pair on each refresh</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Permissions Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Permissions</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div 
                className="detail-item" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  opacity: user.role === 'admin' ? 1 : 0.5 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                  <span>View Profiles</span>
                </div>
                <span className="badge badge-green">Allowed</span>
              </div>

              <div 
                className="detail-item" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  opacity: user.role === 'admin' ? 1 : 0.5 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                  <span>Search Profiles</span>
                </div>
                <span className="badge badge-green">Allowed</span>
              </div>

              <div 
                className="detail-item" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  opacity: user.role === 'admin' ? 1 : 0.5 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                  <span>Export Data</span>
                </div>
                <span className="badge badge-green">Allowed</span>
              </div>

              <div 
                className="detail-item" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  opacity: user.role === 'admin' ? 1 : 0.5 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {user.role === 'admin' ? (
                    <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />
                  )}
                  <span>Create Profiles</span>
                </div>
                <span className={`badge badge-${user.role === 'admin' ? 'green' : 'red'}`}>
                  {user.role === 'admin' ? 'Allowed' : 'Denied'}
                </span>
              </div>

              <div 
                className="detail-item" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  opacity: user.role === 'admin' ? 1 : 0.5 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {user.role === 'admin' ? (
                    <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />
                  )}
                  <span>Delete Profiles</span>
                </div>
                <span className={`badge badge-${user.role === 'admin' ? 'green' : 'red'}`}>
                  {user.role === 'admin' ? 'Allowed' : 'Denied'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
