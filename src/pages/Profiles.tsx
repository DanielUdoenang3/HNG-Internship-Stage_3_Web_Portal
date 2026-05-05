import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { profileService } from '../services/profiles';
import { useAuth } from '../contexts/AuthContext';
import type { Profile, ProfileFilters, PaginatedResponse } from '../types';

const GENDERS = ['male', 'female'];
const AGE_GROUPS = ['child', 'teen', 'adult', 'senior'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'age', label: 'Age' },
  { value: 'created_at', label: 'Created Date' },
];

const Profiles = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState<PaginatedResponse<Profile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [creating, setCreating] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<ProfileFilters>({
    gender: searchParams.get('gender') || undefined,
    country: searchParams.get('country') || undefined,
    age_group: searchParams.get('age_group') || undefined,
    min_age: searchParams.get('min_age') ? parseInt(searchParams.get('min_age')!) : undefined,
    max_age: searchParams.get('max_age') ? parseInt(searchParams.get('max_age')!) : undefined,
    sort_by: searchParams.get('sort_by') || 'created_at',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
  });

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfiles(filters);
      setProfiles(data);
    } catch (err) {
      setError('Failed to load profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const updateFilters = (newFilters: Partial<ProfileFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = async () => {
    try {
      const blob = await profileService.exportProfiles(filters);
      profileService.downloadCSV(blob);
    } catch (err) {
      setError('Failed to export profiles');
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    try {
      setCreating(true);
      await profileService.createProfile({ name: newProfileName.trim() });
      setNewProfileName('');
      setShowCreateModal(false);
      fetchProfiles();
    } catch (err) {
      setError('Failed to create profile');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      await profileService.deleteProfile(id);
      fetchProfiles();
    } catch (err) {
      setError('Failed to delete profile');
      console.error(err);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Profiles</h1>
        <div className="page-header-right" style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExport} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {isAdmin && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Profile</span>
            </button>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="filters-bar">
          <div className="filter-group">
            <Filter size={16} className="text-muted" />
            <span className="filter-label">Filters:</span>
          </div>
          
          <select
            className="form-select filter-select"
            value={filters.gender || ''}
            onChange={(e) => updateFilters({ gender: e.target.value || undefined })}
          >
            <option value="">All Genders</option>
            {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
          </select>

          <select
            className="form-select filter-select"
            value={filters.age_group || ''}
            onChange={(e) => updateFilters({ age_group: e.target.value || undefined })}
          >
            <option value="">All Age Groups</option>
            {AGE_GROUPS.map(ag => <option key={ag} value={ag}>{ag.charAt(0).toUpperCase() + ag.slice(1)}</option>)}
          </select>

          <input
            type="text"
            className="form-input filter-input"
            placeholder="Country code (e.g., US)"
            value={filters.country || ''}
            onChange={(e) => updateFilters({ country: e.target.value.toUpperCase() || undefined })}
            style={{ width: '180px' }}
          />

          <div className="filter-group" style={{ marginLeft: 'auto' }}>
            <span className="filter-label">Sort by:</span>
            <select
              className="form-select filter-select"
              value={filters.sort_by}
              onChange={(e) => updateFilters({ sort_by: e.target.value })}
            >
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => updateFilters({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
            >
              {filters.order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ margin: '1rem 1.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
              Dismiss
            </button>
          </div>
        )}

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Country</th>
                <th>Created</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : profiles?.data.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Search size={32} />
                      </div>
                      <h3 className="empty-title">No profiles found</h3>
                      <p className="empty-description">Try adjusting your filters or create a new profile.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                profiles?.data.map((profile: Profile) => (
                  <tr key={profile.id}>
                    <td>
                      <Link to={`/profiles/${profile.id}`} className="font-medium" style={{ color: 'var(--color-primary)' }}>
                        {profile.name}
                      </Link>
                    </td>
                    <td>
                      {profile.gender ? (
                        <span className={`badge badge-${profile.gender === 'male' ? 'blue' : 'green'}`}>
                          {profile.gender}
                        </span>
                      ) : (
                        <span className="text-muted">Unknown</span>
                      )}
                    </td>
                    <td>{profile.age || <span className="text-muted">Unknown</span>}</td>
                    <td>{profile.country_name || profile.country_id || <span className="text-muted">Unknown</span>}</td>
                    <td className="text-muted">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {profiles && profiles.total_pages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {((profiles.page - 1) * profiles.limit) + 1} to {Math.min(profiles.page * profiles.limit, profiles.total)} of {profiles.total} results
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(profiles.page - 1)}
                disabled={!profiles.links.prev}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: profiles.total_pages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === profiles.total_pages || 
                  (page >= profiles.page - 2 && page <= profiles.page + 2)
                )
                .map((page, index, array) => (
                  <span key={page} style={{ display: 'flex', gap: '0.25rem' }}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="pagination-btn" style={{ cursor: 'default' }}>...</span>
                    )}
                    <button
                      className={`pagination-btn ${page === profiles.page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </span>
                ))}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(profiles.page + 1)}
                disabled={!profiles.links.next}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Profile</h3>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Enter person's full name"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? (
                    <>
                      <div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;
