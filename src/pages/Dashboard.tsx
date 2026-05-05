import { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Globe,
  Clock
} from 'lucide-react';
import { dashboardService } from '../services/dashboard';
import type { DashboardMetrics } from '../types';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load dashboard metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-screen" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics || metrics.status === 'error') {
    return (
      <div className="page-content">
        <div className="alert alert-error">
          <span>{error || metrics?.message || 'Failed to load dashboard'}</span>
        </div>
      </div>
    );
  }

  const { data } = metrics;

  return (
    <div className="page-content">
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-header-right">
          <span className="text-muted" style={{ fontSize: '0.875rem' }}>
            <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-value">{data.total_profiles.toLocaleString()}</div>
          <div className="stat-label">Total Profiles</div>
          <div className="stat-change positive">
            +{data.new_profiles_today} today
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-value">{data.total_users}</div>
          <div className="stat-label">Registered Users</div>
          <div className="stat-change positive">
            Analysts & Admins
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Activity size={24} />
          </div>
          <div className="stat-value">{data.active_sessions}</div>
          <div className="stat-label">Active Sessions</div>
          <div className="stat-change">
            Currently online
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Globe size={24} />
          </div>
          <div className="stat-value">{data.profiles_by_country?.length || 0}</div>
          <div className="stat-label">Countries</div>
          <div className="stat-change">
            Covered
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Profiles by Country */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Profiles by Country</h2>
          </div>
          <div className="card-body">
            {data.profiles_by_country?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.profiles_by_country.slice(0, 10).map((item) => (
                  <div 
                    key={item.country} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.5rem 0'
                    }}
                  >
                    <span className="font-medium">{item.country}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div 
                        style={{ 
                          width: '100px', 
                          height: '6px', 
                          backgroundColor: 'var(--color-bg-tertiary)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{ 
                            width: `${(item.count / data.total_profiles) * 100}%`, 
                            height: '100%', 
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.875rem', minWidth: '40px' }}>
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p className="text-muted">No country data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Profiles by Age Group */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Profiles by Age Group</h2>
          </div>
          <div className="card-body">
            {data.profiles_by_age_group?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.profiles_by_age_group.map((item) => (
                  <div 
                    key={item.age_group} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.5rem 0'
                    }}
                  >
                    <span className="font-medium" style={{ textTransform: 'capitalize' }}>
                      {item.age_group}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div 
                        style={{ 
                          width: '100px', 
                          height: '6px', 
                          backgroundColor: 'var(--color-bg-tertiary)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{ 
                            width: `${(item.count / data.total_profiles) * 100}%`, 
                            height: '100%', 
                            backgroundColor: 'var(--color-success)',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.875rem', minWidth: '40px' }}>
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p className="text-muted">No age group data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Profiles */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">Recently Added Profiles</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_profiles?.length > 0 ? (
                data.recent_profiles.slice(0, 5).map((profile) => (
                  <tr key={profile.id} className="table-row-link">
                    <td className="font-medium">{profile.name}</td>
                    <td>{profile.country_name || profile.country_id || 'Unknown'}</td>
                    <td>{profile.age || 'Unknown'}</td>
                    <td>
                      {profile.gender ? (
                        <span className={`badge badge-${profile.gender === 'male' ? 'blue' : profile.gender === 'female' ? 'green' : 'gray'}`}>
                          {profile.gender}
                        </span>
                      ) : (
                        'Unknown'
                      )}
                    </td>
                    <td className="text-muted">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    <p className="text-muted">No profiles found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
