
import { supabase } from '../lib/supabase';

const sanitize = (value) => String(value).replace(/[,()%]/g, ' ').trim();

export const musicianService = {
  async getMusicians(filters = {}) {
    const {
      location = '',
      role = '',
      genre = '',
      search = '',
      excludeId = ''
    } = filters;

    const locationTerm = sanitize(location);
    const roleTerm = sanitize(role);
    const genreTerm = sanitize(genre);
    const searchTerm = sanitize(search);

    let query = supabase
      .from('profiles')
      .select('*');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    if (locationTerm) {
      query = query.ilike('location', `%${locationTerm}%`);
    }

    if (genreTerm) {
      query = query.ilike('genre', `%${genreTerm}%`);
    }

    // The filter bar combines roles and instruments into a single dropdown,
    // so the selected value must match either the role or the instrument column.
    if (roleTerm) {
      query = query.or(
        `role.ilike.%${roleTerm}%,instrument.ilike.%${roleTerm}%`
      );
    }

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,instrument.ilike.%${searchTerm}%,genre.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getMusicianById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
