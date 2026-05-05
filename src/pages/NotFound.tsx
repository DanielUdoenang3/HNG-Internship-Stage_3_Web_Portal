import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h1 className="error-title">Page Not Found</h1>
      <p className="error-message">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
        <ArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
