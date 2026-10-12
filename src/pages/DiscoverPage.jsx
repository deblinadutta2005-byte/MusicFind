import React, { useState, useEffect, useCallback } from 'react';
import { Compass, Music2, RefreshCw, Sparkles, SlidersHorizontal, SearchX } from 'lucide-react';
import { musicianService } from '../services/musicianService';
import { useAuth } from '../context/AuthContext';
import { FilterBar } from '../components/FilterBar';
import { ProfileCard } from '../components/ProfileCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';

export function DiscoverPage() {
  const { user } = useAuth();
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    role: '',
    genre: '',
    search: ''
  });

  const fetchMusicians = useCallback(async (currentFilters, userId) => {
    setLoading(true);
    setError('');
    try {
      const data = await musicianService.getMusicians({
        ...currentFilters,
        excludeId: userId
      });
      setMusicians(data);
    } catch (err) {
      setError(err.message || 'Unable to load musicians. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMusicians(filters, user?.id);
  }, [fetchMusicians, filters, user?.id]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ location: '', role: '', genre: '', search: '' });
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="discover-header-section">
        <div className="discover-title-row">
          <div>
            <div className="page-badge">
              <Compass size={16} className="text-accent" />
              <span>Musician Directory</span>
            </div>
            <h1 className="page-title">Discover Musicians</h1>
            <p className="page-subtitle">
              Filter by instrument, genre, and location to connect with your next bandmate or jamming partner.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <FilterBar
          filters={filters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          totalCount={musicians.length}
        />
      </div>

      {/* Content State: Loading, Error, or Grid */}
      <div className="discover-content-area">
        {loading ? (
          <div className="discover-loading-box">
            <LoadingSpinner message="Loading musicians..." />
          </div>
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchMusicians(filters, user?.id)}
            className="max-w-xl mx-auto my-12"
          />
        ) : musicians.length === 0 ? (
          /* PRD Section 9: "If no result matches the filters, show 'No musicians found' and offer Clear Filters." */
          <div className="empty-results-box">
            <div className="empty-results-icon">
              <SearchX size={48} className="text-muted" />
            </div>
            <h3 className="empty-results-title">No musicians found</h3>
            <p className="empty-results-text">
              We couldn't find any musicians matching your exact filters. Try adjusting your search or clear all filters to see everyone.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={RefreshCw}
              onClick={handleClearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="musicians-grid">
            {musicians.map((musician) => (
              <ProfileCard
                key={musician.id || musician.userId}
                musician={musician}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
