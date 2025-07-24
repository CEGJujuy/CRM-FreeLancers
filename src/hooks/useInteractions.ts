import { useState, useEffect } from 'react';
import { Interaction, InteractionType } from '../types';
import { getFromStorage, saveToStorage, generateId, STORAGE_KEYS } from '../lib/localStorage';

// Datos iniciales para el primer uso
const initialInteractions: Interaction[] = [
  {
    id: '1',
    client_id: '1',
    type: 'email',
    description: 'Envié propuesta inicial para tienda online con catálogo de productos y carrito de compras',
    date: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    client_id: '2',
    type: 'llamada',
    description: 'Llamada para discutir requerimientos técnicos de la app móvil y timeline del proyecto',
    date: '2024-01-12T15:30:00Z',
    created_at: '2024-01-12T15:30:00Z',
  },
  {
    id: '3',
    client_id: '1',
    type: 'reunion',
    description: 'Reunión presencial para revisar diseños y mockups de la tienda online',
    date: '2024-01-18T11:00:00Z',
    created_at: '2024-01-18T11:00:00Z',
  },
  {
    id: '4',
    client_id: '3',
    type: 'email',
    description: 'Primer contacto, envié portfolio y casos de éxito en branding',
    date: '2024-01-20T14:15:00Z',
    created_at: '2024-01-20T14:15:00Z',
  },
  {
    id: '5',
    client_id: '4',
    type: 'propuesta',
    description: 'Envié propuesta detallada para migración de tienda física a e-commerce',
    date: '2024-01-19T09:30:00Z',
    created_at: '2024-01-19T09:30:00Z',
  },
  {
    id: '6',
    client_id: '2',
    type: 'seguimiento',
    description: 'Seguimiento post-propuesta, cliente interesado en proceder con el desarrollo',
    date: '2024-01-22T16:00:00Z',
    created_at: '2024-01-22T16:00:00Z',
  },
];

export const useInteractions = (clientId?: string) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar interacciones del localStorage al inicializar
  useEffect(() => {
    try {
      setLoading(true);
      const storedInteractions = getFromStorage(STORAGE_KEYS.INTERACTIONS, []);
      
      // Si no hay interacciones guardadas, usar datos iniciales
      if (storedInteractions.length === 0) {
        setInteractions(initialInteractions);
        saveToStorage(STORAGE_KEYS.INTERACTIONS, initialInteractions);
      } else {
        setInteractions(storedInteractions);
      }
    } catch (err) {
      setError('Error al cargar interacciones');
      setInteractions(initialInteractions);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar por cliente si se especifica
  const filteredInteractions = clientId 
    ? interactions.filter(i => i.client_id === clientId)
    : interactions;

  // Guardar interacciones en localStorage
  const saveInteractions = (newInteractions: Interaction[]) => {
    setInteractions(newInteractions);
    saveToStorage(STORAGE_KEYS.INTERACTIONS, newInteractions);
  };

  const addInteraction = async (interactionData: Omit<Interaction, 'id' | 'created_at'>) => {
    try {
      const newInteraction: Interaction = {
        ...interactionData,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      
      const updatedInteractions = [newInteraction, ...interactions];
      saveInteractions(updatedInteractions);
      return newInteraction;
    } catch (err) {
      setError('Error al crear interacción');
      throw err;
    }
  };

  const deleteInteraction = async (id: string) => {
    try {
      const updatedInteractions = interactions.filter(interaction => interaction.id !== id);
      saveInteractions(updatedInteractions);
    } catch (err) {
      setError('Error al eliminar interacción');
      throw err;
    }
  };

  const refetch = () => {
    const storedInteractions = getFromStorage(STORAGE_KEYS.INTERACTIONS, []);
    setInteractions(storedInteractions);
  };

  return {
    interactions: filteredInteractions,
    loading,
    error,
    addInteraction,
    deleteInteraction,
    refetch,
  };
};