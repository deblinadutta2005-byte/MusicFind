import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileForm } from '../components/ProfileForm';
import { ErrorMessage } from '../components/ErrorMessage';
import { profileService } from '../services/profileService';

export function CreateProfilePage() {
  const { user, createProfile } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setServerError('');

    try {
      const { profileImageFile, ...profileFields } = formData;

      // First, create the profile in Supabase.
      await createProfile({
        ...profileFields,
        email: user?.email
      });

      // Then, upload the selected image, if one was chosen.
      if (profileImageFile) {
        const imageUrl = await profileService.uploadProfileImage(
          profileImageFile,
          user.id
        );

        // Save the permanent image URL to the profile.
        await createProfile({
          ...profileFields,
          email: user?.email,
          profileImage: imageUrl
        });
      }

      // Continue to the Discover page.
      navigate('/discover');
    } catch (err) {
      setServerError(err.message || 'Unable to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="page-container">
      <div className="form-page-header">
        <div className="form-header-badge">
          <Sparkles size={16} className="text-accent" />
          <span>Step 2 of 2: Artist Identity</span>
        </div>
        <h1 className="page-title">Build Your Musician Profile</h1>
        <p className="page-subtitle">
          Tell local musicians what instruments you play, your musical genres, experience, and what you want to achieve together.
        </p>
      </div>

      {serverError && (
        <ErrorMessage message={serverError} className="max-w-2xl mx-auto mb-6" />
      )}

      <div className="form-wrapper-card">
        <ProfileForm
          initialValues={{
            name: user?.name || '',
            location: 'Kolkata',
            role: 'Musician',
            instrument: 'Guitar',
            genre: 'Rock',
            lookingFor: 'Jamming'
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Complete Profile & Enter Discover"
        />
      </div>
    </div>
  );
}
