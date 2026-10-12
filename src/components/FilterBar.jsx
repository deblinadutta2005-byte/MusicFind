import React, { useState } from 'react';
import { Search, MapPin, Music, Disc3, Filter, RotateCcw } from 'lucide-react';
import { GENRES, INSTRUMENTS, ROLES, POPULAR_LOCATIONS } from '../data/constants';
import { Button } from './Button';

export function FilterBar({ filters, onFilterChange, onApply, onClear, totalCount }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onApply(localFilters);
  };

  const handleReset = () => {
    const cleared = { location: '', role: '', genre: '', search: '' };
    setLocalFilters(cleared);
    onClear();
  };

  // Combine roles and instruments for quick filtering
  const roleInstrumentOptions = [
    { label: 'All Roles & Instruments', value: '' },
    ...ROLES.map(r => ({ label: `Role: ${r}`, value: r })),
    ...INSTRUMENTS.map(i => ({ label: `Instrument: ${i}`, value: i }))
  ];

  const hasActiveFilters = Boolean(
    localFilters.location || localFilters.role || localFilters.genre || localFilters.search
  );

  return (
    <div className="filter-bar-container">
      {/* Search and Quick Filters Header */}
      <div className="filter-bar-header">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by artist name, bio, instrument..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApply(localFilters)}
            className="search-input"
          />
        </div>

        <button
          className="mobile-filter-toggle-btn"
          onClick={() => setIsExpandedMobile(!isExpandedMobile)}
          type="button"
        >
          <Filter size={16} />
          <span>Filters {hasActiveFilters && '(Active)'}</span>
        </button>
      </div>

      {/* Main Filter Controls (Horizontal on Desktop, stacked on Mobile) */}
      <form
        onSubmit={handleFormSubmit}
        className={`filter-controls-form ${isExpandedMobile ? 'is-expanded-mobile' : ''}`}
      >
        <div className="filter-dropdown-grid">
          {/* Location Dropdown / Input */}
          <div className="filter-field">
            <label className="filter-field-label">
              <MapPin size={14} className="text-accent" />
              <span>Location</span>
            </label>
            <div className="filter-input-wrap">
              <select
                value={localFilters.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {POPULAR_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Instrument / Role Dropdown */}
          <div className="filter-field">
            <label className="filter-field-label">
              <Music size={14} className="text-accent" />
              <span>Role / Instrument</span>
            </label>
            <div className="filter-input-wrap">
              <select
                value={localFilters.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="filter-select"
              >
                {roleInstrumentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre Dropdown */}
          <div className="filter-field">
            <label className="filter-field-label">
              <Disc3 size={14} className="text-accent" />
              <span>Genre</span>
            </label>
            <div className="filter-input-wrap">
              <select
                value={localFilters.genre || ''}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions-row">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Filter}
            className="filter-apply-btn"
          >
            Apply Filters
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleReset}
              icon={RotateCcw}
              className="filter-clear-btn"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </form>

      {/* Filter summary status bar */}
      <div className="filter-status-summary">
        <span className="results-count-text">
          Showing <strong>{totalCount}</strong> {totalCount === 1 ? 'musician' : 'musicians'}
        </span>
        {hasActiveFilters && (
          <div className="active-filter-chips">
            {localFilters.location && (
              <span className="filter-chip">
                Loc: {localFilters.location}
              </span>
            )}
            {localFilters.role && (
              <span className="filter-chip">
                Role: {localFilters.role}
              </span>
            )}
            {localFilters.genre && (
              <span className="filter-chip">
                Genre: {localFilters.genre}
              </span>
            )}
            {localFilters.search && (
              <span className="filter-chip">
                "{localFilters.search}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
