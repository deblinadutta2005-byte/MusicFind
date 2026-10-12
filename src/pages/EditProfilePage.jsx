import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { ProfileForm } from '../components/ProfileForm';
import { ErrorMessage } from '../components/ErrorMessage';

export function EditProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const { profileImageFile, ...profileFields } = formData;

      // Save the normal profile details first.
      await updateProfile(profileFields);

      // Upload the selected picture, if the user chose one.
      if (profileImageFile) {
        const imageUrl = await profileService.uploadProfileImage(
          profileImageFile,
          user.id
        );

        // Update the profile state with the permanent image URL.
        await updateProfile({ profileImage: imageUrl });
      }

      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Unable to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="page-container">
      <div className="profile-top-navigation">
        <Link to="/profile" className="btn-back">
          <ArrowLeft size={18} />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="form-page-header">
        <div className="form-header-badge">
          <Edit3 size={16} className="text-accent" />
          <span>Artist Settings</span>
        </div>
        <h1 className="page-title">Edit Your Musician Profile</h1>
        <p className="page-subtitle">
          Keep your instrument skills, preferred genres, looking-for status, and social channels up to date.
        </p>
      </div>

      {error && (
        <ErrorMessage message={error} className="max-w-2xl mx-auto mb-6" />
      )}

      <div className="form-wrapper-card">
        <ProfileForm
          initialValues={profile || {}}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
}
