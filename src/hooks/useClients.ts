import { useState, useEffect } from 'react';
import { Client, ClientStatus } from '../types';
import { supabase, isMockMode } from '../lib/supabase';

// Mock data para pruebas
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana@empresa.com',
    phone: '+34 600 123 456',
    company: 'Tech Solutions SL',
    status: 'interesado',
    tags: ['desarrollo web', 'e-commerce'],
    estimated_value: 5000,
    source: 'linkedin',
    notes: 'Interesada en tienda online',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos@startup.com',
    phone: '+34 600 789 012',
    company: 'StartupXYZ',
    status: 'propuesta',
    tags: ['app móvil', 'react native'],
    estimated_value: 12000,
    source: 'referido',
    notes: 'App para delivery',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria@consultora.com',
    company: 'Consultora Digital',
    status: 'nuevo',
    tags: ['diseño', 'branding'],
    estimated_value: 3000,
    source: 'instagram',
    notes: 'Rediseño de marca',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z',
  },
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      if (isMockMode) {
        // Usar datos mock en modo demo
        setTimeout(() => {
          setClients(mockClients);
          setLoading(false);
        }, 500);
        return;
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
      // Fallback a datos mock en caso de error
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (isMockMode) {
        const newClient: Client = {
          ...clientData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setClients(prev => [newClient, ...prev]);
        return newClient;
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente');
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      if (isMockMode) {
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { ...client, ...updates, updated_at: new Date().toISOString() }
            : client
        ));
        return;
      }

      const { error } = await supabase
        .from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setClients(prev => prev.map(client => 
        client.id === id 
          ? { ...client, ...updates, updated_at: new Date().toISOString() }
          : client
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      if (isMockMode) {
        setClients(prev => prev.filter(client => client.id !== id));
        return;
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente');
      throw err;
    }
  };

  const getClientsByStatus = (status: ClientStatus) => {
    return clients.filter(client => client.status === status);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClientsByStatus,
    refetch: fetchClients,
  };
};