import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { profileService } from '../services/profiles';
import type { SearchResult, Profile } from '../types';

const SUGGESTIONS = [
  'young males from nigeria',
  'adult females from united states',
  'seniors from japan',
  'teenagers from brazil',
];

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await profileService.searchProfiles({ query: searchQuery, page, limit: 20 });
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handlePageChange = (page: number) => {
    performSearch(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-content">
      {/* Search Hero */}
      <div className="search-hero">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles size={28} style={{ color: 'var(--color-primary)' }} />
          <h1>Natural Language Search</h1>
        </div>
        <p>
          Search profiles using natural language. Try queries like 
          "young males from Nigeria" or "adult females from United States"
        </p>

        <form onSubmit={handleSubmit} className="search-box-large">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            disabled={loading}
          />
        </form>

        {!hasSearched && (
          <div className="search-suggestions">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Try these examples:</p>
            <div className="suggestion-chips">
              {SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="card">
          <div className="card-header" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
            <h2 className="card-title">Search Results</h2>
            {results && (
              <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                {results.total} results for "{results.query}"
              </span>
            )}
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Country</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : results?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                      <div className="empty-state">
                        <div className="empty-icon">
                          <SearchIcon size={32} />
                        </div>
                        <h3 className="empty-title">No results found</h3>
                        <p className="empty-description">
                          Try a different search query or check your spelling.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  results?.data.map((profile: Profile) => (
                    <tr key={profile.id}>
                      <td>
                        <Link 
                          to={`/profiles/${profile.id}`} 
                          className="font-medium" 
                          style={{ color: 'var(--color-primary)' }}
                        >
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {results && results.total_pages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Page {results.page} of {results.total_pages}
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(results.page - 1)}
                  disabled={!results.links.prev}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: results.total_pages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === results.total_pages || 
                    (page >= results.page - 2 && page <= results.page + 2)
                  )
                  .map((page, index, array) => (
                    <span key={page} style={{ display: 'flex', gap: '0.25rem' }}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="pagination-btn" style={{ cursor: 'default' }}>...</span>
                      )}
                      <button
                        className={`pagination-btn ${page === results.page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(results.page + 1)}
                  disabled={!results.links.next}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
