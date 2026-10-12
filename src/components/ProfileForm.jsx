import React, { useEffect, useState } from 'react';
import {
  User,
  Music,
  MapPin,
  Compass,
  Globe,
  Sparkles,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { GENRES, INSTRUMENTS, ROLES, LOOKING_FOR, POPULAR_LOCATIONS } from '../data/constants';
import { Input, Textarea } from './Input';
import { Select } from './Select';
import { CheckboxGroup } from './CheckboxGroup';
import { Button } from './Button';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80'
];

export function ProfileForm({
  initialValues = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Profile'
}) {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    profileImage: initialValues.profileImage || SAMPLE_AVATARS[0],
    role: initialValues.role || 'Musician',
    instrument: toArray(initialValues.instrument || 'Guitar'),
    genre: toArray(initialValues.genre || 'Rock'),
    location: initialValues.location || 'Kolkata',
    experience: initialValues.experience || '',
    lookingFor: initialValues.lookingFor || 'Jamming',
    bio: initialValues.bio || '',
    instagramUrl: initialValues.instagramUrl || '',
    facebookUrl: initialValues.facebookUrl || '',
    otherSocialUrl: initialValues.otherSocialUrl || ''
  });

  const [errors, setErrors] = useState({});

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!selectedImageFile) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(selectedImageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImageFile]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Display name is required.';
    if (!formData.role) errs.role = 'Please select a role.';
    if (!formData.instrument.length) errs.instrument = 'Please select at least one instrument.';
    if (!formData.genre.length) errs.genre = 'Please select at least one genre.';
    if (!formData.location.trim()) errs.location = 'Location is required.';
    if (!formData.lookingFor) errs.lookingFor = 'Please specify what you are looking for.';
    if (!formData.bio.trim()) errs.bio = 'Please add a short bio describing your sound.';
    return errs;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...formData,
      instrument: formData.instrument.join(', '),
      genre: formData.genre.join(', '),
      profileImageFile: selectedImageFile
    });

  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form">
      {/* Profile Image & Avatar Picker */}
      <div className="form-card-section">
        <h3 className="section-subtitle">
          <ImageIcon size={18} className="text-accent" />
          <span>Profile Picture</span>
        </h3>
        <div className="avatar-selection-layout">
          <div className="current-avatar-preview">
            <img
              src={previewUrl || formData.profileImage || SAMPLE_AVATARS[0]}
              alt="Avatar preview"
              className="avatar-large-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600';
              }}
            />
          </div>
          <div className="avatar-options-box">
            <label className="form-label">Pick a preset portrait or enter a custom image URL:</label>
            <div className="preset-avatars-grid">
              {SAMPLE_AVATARS.map((avatarUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`avatar-preset-btn ${formData.profileImage === avatarUrl ? 'selected' : ''}`}
                  onClick={() => handleChange('profileImage', avatarUrl)}
                >
                  <img src={avatarUrl} alt={`Preset ${idx + 1}`} />
                  {formData.profileImage === avatarUrl && (
                    <div className="preset-selected-check">
                      <CheckCircle size={14} />
                    </div>
                  )}
                </button>
              ))}


              <div className="mt-3">
                <label className="form-label" htmlFor="profile-image-upload">
                  Or upload your own picture:
                </label>

                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (!file.type.startsWith('image/')) {
                      alert('Please select an image file.');
                      e.target.value = '';
                      return;
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      alert('Please choose an image smaller than 5 MB.');
                      e.target.value = '';
                      return;
                    }

                    setSelectedImageFile(file);
                  }}
                />

                {selectedImageFile && (
                  <p className="text-sm mt-2">
                    Selected: {selectedImageFile.name}
                  </p>
                )}
              </div>

            </div>
            <Input
              placeholder="Or paste an image URL (https://...)"
              value={formData.profileImage}
              onChange={(e) => handleChange('profileImage', e.target.value)}
              className="mt-3"
            />
          </div>
        </div>
      </div>

      {/* Core Musician Identity */}
      <div className="form-card-section">
        <h3 className="section-subtitle">
          <User size={18} className="text-accent" />
          <span>Artist Identity</span>
        </h3>

        <div className="form-grid-2">
          <Input
            label="Display Name / Stage Name"
            placeholder="e.g. Alex Rivera or Cosmic Rhythms"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
            icon={User}
          />

          <Input
            label="Location (City / Area)"
            placeholder="e.g. Kolkata, Mumbai, Brooklyn"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            error={errors.location}
            required
            icon={MapPin}
          />
        </div>

        <div className="form-grid-3">
          <Select
            label="Role"
            options={ROLES}
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            error={errors.role}
            required
          />

          <Select
            label="Looking For"
            options={LOOKING_FOR}
            value={formData.lookingFor}
            onChange={(e) => handleChange('lookingFor', e.target.value)}
            error={errors.lookingFor}
            required
          />

          <Input
            label="Experience Level / Years"
            placeholder="e.g. 5 years playing live rock gigs"
            value={formData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            icon={Sparkles}
          />
        </div>

        <CheckboxGroup
          label="Instruments You Play"
          options={INSTRUMENTS}
          value={formData.instrument}
          onChange={(next) => handleChange('instrument', next)}
          error={errors.instrument}
          required
        />

        <CheckboxGroup
          label="Genres You Play"
          options={GENRES}
          value={formData.genre}
          onChange={(next) => handleChange('genre', next)}
          error={errors.genre}
          required
        />

        <Textarea
          label="Bio & Sound Description"
          placeholder="Tell other musicians about your musical influences, favourite bands, style of playing, and what kind of projects excite you..."
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          error={errors.bio}
          rows={4}
          required
        />
      </div>

      {/* External Social Profiles */}
      <div className="form-card-section">
        <h3 className="section-subtitle">
          <Globe size={18} className="text-accent" />
          <span>External Social Profiles & Music Links</span>
        </h3>
        <p className="section-desc">
          After you connect with musicians, they will use these external links to talk and collaborate with you.
        </p>

        <div className="form-grid-3">
          <Input
            label="Instagram Profile URL"
            placeholder="https://instagram.com/your_handle"
            value={formData.instagramUrl}
            onChange={(e) => handleChange('instagramUrl', e.target.value)}
            icon={InstagramIcon}
          />

          <Input
            label="Facebook Profile URL"
            placeholder="https://facebook.com/your_profile"
            value={formData.facebookUrl}
            onChange={(e) => handleChange('facebookUrl', e.target.value)}
            icon={FacebookIcon}
          />

          <Input
            label="Other Link (Spotify/SoundCloud/YouTube)"
            placeholder="https://spotify.com/artist/..."
            value={formData.otherSocialUrl}
            onChange={(e) => handleChange('otherSocialUrl', e.target.value)}
            icon={Globe}
          />
        </div>
      </div>

      {/* Submission Button */}
      <div className="form-submit-row">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          loadingText="Saving Profile..."
          icon={Sparkles}
          className="w-full-md"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
