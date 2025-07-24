import { useState, useEffect } from 'react';
import { Interaction, InteractionType } from '../types';
import { supabase, isMockMode } from '../lib/supabase';

// Mock data para pruebas
const mockInteractions: Interaction[] = [
  {
    id: '1',
    client_id: '1',
    type: 'email',
    description: 'Envié propuesta inicial para tienda online',
    date: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    client_id: '2',
    type: 'llamada',
    description: 'Llamada para discutir requerimientos de la app',
    date: '2024-01-12T15:30:00Z',
    created_at: '2024-01-12T15:30:00Z',
  },
  {
    id: '3',
    client_id: '1',
    type: 'reunion',
    description: 'Reunión presencial para revisar diseños',
    date: '2024-01-18T11:00:00Z',
    created_at: '2024-01-18T11:00:00Z',
  },
];

export const useInteractions = (clientId?: string) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      
      if (isMockMode) {
        setTimeout(() => {
          const filtered = clientId 
            ? mockInteractions.filter(i => i.client_id === clientId)
            : mockInteractions;
          setInteractions(filtered);
          setLoading(false);
        }, 300);
        return;
      }

      let query = supabase
        .from('interactions')
        .select('*')
        .order('date', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInteractions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar interacciones');
      // Fallback a datos mock
      const filtered = clientId 
        ? mockInteractions.filter(i => i.client_id === clientId)
        : mockInteractions;
      setInteractions(filtered);
    } finally {
      setLoading(false);
    }
  };

  const addInteraction = async (interactionData: Omit<Interaction, 'id' | 'created_at'>) => {
    try {
      if (isMockMode) {
        const newInteraction: Interaction = {
          ...interactionData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setInteractions(prev => [newInteraction, ...prev]);
        return newInteraction;
      }

      const { data, error } = await supabase
        .from('interactions')
        .insert([interactionData])
        .select()
        .single();

      if (error) throw error;
      
      setInteractions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear interacción');
      throw err;
    }
  };

  const deleteInteraction = async (id: string) => {
    try {
      if (isMockMode) {
        setInteractions(prev => prev.filter(interaction => interaction.id !== id));
        return;
      }

      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInteractions(prev => prev.filter(interaction => interaction.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar interacción');
      throw err;
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [clientId]);

  return {
    interactions,
    loading,
    error,
    addInteraction,
    deleteInteraction,
    refetch: fetchInteractions,
  };
};