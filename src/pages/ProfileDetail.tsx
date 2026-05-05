import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Globe, 
  User, 
  AlertCircle,
  Trash2,
  Edit
} from 'lucide-react';
import { profileService } from '../services/profiles';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../types';

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getProfile(id);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleDelete = async () => {
    if (!profile || !confirm('Are you sure you want to delete this profile?')) return;

    try {
      await profileService.deleteProfile(profile.id);
      navigate('/profiles');
    } catch (err) {
      setError('Failed to delete profile');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-screen" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-content">
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error || 'Profile not found'}</span>
        </div>
        <Link to="/profiles" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Profiles</span>
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-left">
          <Link to="/profiles" className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="page-title">Profile Details</h1>
        </div>
        <div className="page-header-right" style={{ display: 'flex', gap: '0.75rem' }}>
          {isAdmin && (
            <>
              <button className="btn btn-secondary">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(profile.name)}
        </div>
        <div className="profile-header-info">
          <h1>{profile.name}</h1>
          <div className="profile-meta">
            {profile.gender && (
              <span className={`badge badge-${profile.gender === 'male' ? 'blue' : 'green'}`}>
                {profile.gender}
              </span>
            )}
            {profile.age_group && (
              <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                {profile.age_group}
              </span>
            )}
            <span className="text-muted">
              <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Added {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="detail-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Demographics</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="detail-item">
                <div className="detail-label">Full Name</div>
                <div className="detail-value">{profile.name}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Gender</div>
                <div className="detail-value">
                  {profile.gender ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} />
                      {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                      {profile.gender_probability && (
                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                          ({(profile.gender_probability * 100).toFixed(1)}% confidence)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted">Unknown</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Age</div>
                <div className="detail-value">
                  {profile.age ? (
                    <span>
                      {profile.age} years
                      {profile.age_group && (
                        <span className="badge badge-gray" style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>
                          {profile.age_group}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted">Unknown</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Location</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="detail-item">
                <div className="detail-label">Country</div>
                <div className="detail-value">
                  {profile.country_name || profile.country_id ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={16} />
                      {profile.country_name || profile.country_id}
                      {profile.country_probability && (
                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                          ({(profile.country_probability * 100).toFixed(1)}% confidence)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted">Unknown</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Country Code</div>
                <div className="detail-value">
                  {profile.country_id ? (
                    <span className="badge badge-blue">{profile.country_id}</span>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">System Information</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="detail-item">
                <div className="detail-label">Profile ID</div>
                <div className="detail-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                  {profile.id}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Created At</div>
                <div className="detail-value">
                  {new Date(profile.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Data Sources</h2>
        </div>
        <div className="card-body">
          <div className="alert alert-info" style={{ margin: 0 }}>
            <p style={{ margin: 0 }}>
              Profile data aggregated from external APIs:
              <strong> Genderize.io</strong> (gender prediction),
              <strong> Agify.io</strong> (age estimation),
              <strong> Nationalize.io</strong> (country prediction)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
