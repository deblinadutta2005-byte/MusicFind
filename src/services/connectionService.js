
import { supabase } from '../lib/supabase';

export const connectionService = {
  async getConnections(currentUserId) {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

    if (error) {
      throw new Error(error.message);
    }

    const rows = data || [];

    const otherIds = [
      ...new Set(
        rows.map(r => (r.sender_id === currentUserId ? r.receiver_id : r.sender_id))
      )
    ].filter(Boolean);

    let profiles = [];
    if (otherIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherIds);

      if (profileError) {
        throw new Error(profileError.message);
      }

      profiles = profileRows || [];
    }

    const enriched = rows.map(row => {
      const otherId = row.sender_id === currentUserId ? row.receiver_id : row.sender_id;
      const musician = profiles.find(p => p.id === otherId) || null;

      return {
        id: row.id,
        requesterId: row.sender_id,
        receiverId: row.receiver_id,
        status: row.status,
        createdAt: row.created_at || row.createdAt || null,
        musician
      };
    });

    const requestsReceived = enriched.filter(
      c => c.receiverId === currentUserId && c.status === 'pending'
    );

    const requestsSent = enriched.filter(
      c => c.requesterId === currentUserId && c.status === 'pending'
    );

    const acceptedConnections = enriched.filter(
      c => (c.requesterId === currentUserId || c.receiverId === currentUserId) && c.status === 'accepted'
    );

    return {
      requests: requestsReceived,
      sentRequests: requestsSent,
      connections: acceptedConnections
    };
  },


  async sendConnection(targetUserId, currentUserId) {
    // Check whether a request already exists
    const { data: existing, error: checkError } = await supabase
      .from('connections')
      .select('*')
      .eq('sender_id', currentUserId)
      .eq('receiver_id', targetUserId)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    // If a request already exists, don't insert another one
    if (existing) {
      if (existing.status === 'pending') {
        throw new Error('Connection request already sent.');
      }

      if (existing.status === 'accepted') {
        throw new Error('You are already connected.');
      }

      if (existing.status === 'rejected') {
        // Allow re-connecting after a rejection by reviving the request
        const { data: revived, error: reviveError } = await supabase
          .from('connections')
          .update({ status: 'pending' })
          .eq('id', existing.id)
          .select()
          .single();

        if (reviveError) {
          throw new Error(reviveError.message);
        }

        return revived;
      }
    }

    // Create a new request
    const { data, error } = await supabase
      .from('connections')
      .insert({
        sender_id: currentUserId,
        receiver_id: targetUserId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },


  async updateConnection(connectionId, action) {
    const statusMap = {
      accept: 'accepted',
      reject: 'rejected'
    };

    const status = statusMap[action];

    if (!status) {
      throw new Error('Invalid connection action.');
    }

    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', connectionId)
      .eq('receiver_id', (await supabase.auth.getUser()).data.user?.id)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
