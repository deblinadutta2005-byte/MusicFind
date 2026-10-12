
import { supabase } from '../lib/supabase';

export const profileService = {
  async createProfile(profileData, userId) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...profileData,
        id: userId
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },


  async getMyProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateProfile(profileData, userId) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },


  async uploadProfileImage(file, userId) {
    if (!file) {
      throw new Error('Please select an image first.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.');
    }

    // Limit the image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5 MB.');
    }

    const fileExt = file.name.split('.').pop().toLowerCase();
    const filePath = `${userId}/profile-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile pictures')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('profile pictures')
      .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    // Save the image URL in the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ profileImage: imageUrl })
      .eq('id', userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return imageUrl;
  },

};
