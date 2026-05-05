import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  Settings, 
  LogOut, 
  ChevronRight,
  BrainCircuit,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profiles', label: 'Profiles', icon: Users },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/account', label: 'Account', icon: UserCircle },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <BrainCircuit size={22} />
            </div>
            <span>Insighta Labs+</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-section-title">Main Menu</p>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink to={item.path} className="nav-link" end={item.path === '/dashboard'}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    <ChevronRight size={16} className="nav-chevron" style={{ marginLeft: 'auto', opacity: 0.5 }} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {isAdmin && (
            <div className="nav-section">
              <p className="nav-section-title">Administration</p>
              <ul className="nav-list">
                <li className="nav-item">
                  <NavLink to="/profiles" className="nav-link">
                    <Settings size={20} />
                    <span>Create Profile</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <>
              <div className="user-card">
                <img 
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`} 
                  alt={user.username}
                  className="user-avatar"
                />
                <div className="user-info">
                  <p className="user-name">@{user.username}</p>
                  <p className="user-role">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
