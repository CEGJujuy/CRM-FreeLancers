import { useState, useEffect } from 'react';
import { Client, ClientStatus } from '../types';
import { getFromStorage, saveToStorage, generateId, STORAGE_KEYS } from '../lib/localStorage';

// Datos iniciales para el primer uso
const initialClients: Client[] = [
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
    notes: 'Interesada en tienda online con integración de pagos',
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
    notes: 'App para delivery de comida, necesita MVP en 3 meses',
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
    notes: 'Rediseño completo de marca e identidad corporativa',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z',
  },
  {
    id: '4',
    name: 'Pedro Martínez',
    email: 'pedro@tienda.com',
    phone: '+34 600 456 789',
    company: 'Tienda Online Plus',
    status: 'negociacion',
    tags: ['e-commerce', 'wordpress'],
    estimated_value: 8000,
    source: 'web',
    notes: 'Migración de tienda física a online, urgente',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
  {
    id: '5',
    name: 'Laura Fernández',
    email: 'laura@coaching.com',
    phone: '+34 600 321 654',
    company: 'Coaching Profesional',
    status: 'cerrado',
    tags: ['landing page', 'seo'],
    estimated_value: 2500,
    source: 'referido',
    notes: 'Proyecto completado exitosamente, cliente satisfecho',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-25T14:30:00Z',
  },
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes del localStorage al inicializar
  useEffect(() => {
    try {
      setLoading(true);
      const storedClients = getFromStorage(STORAGE_KEYS.CLIENTS, []);
      
      // Si no hay clientes guardados, usar datos iniciales
      if (storedClients.length === 0) {
        setClients(initialClients);
        saveToStorage(STORAGE_KEYS.CLIENTS, initialClients);
      } else {
        setClients(storedClients);
      }
    } catch (err) {
      setError('Error al cargar clientes');
      setClients(initialClients);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar clientes en localStorage cada vez que cambien
  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    saveToStorage(STORAGE_KEYS.CLIENTS, newClients);
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newClient: Client = {
        ...clientData,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updatedClients = [newClient, ...clients];
      saveClients(updatedClients);
      return newClient;
    } catch (err) {
      setError('Error al crear cliente');
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updatedClients = clients.map(client => 
        client.id === id 
          ? { ...client, ...updates, updated_at: new Date().toISOString() }
          : client
      );
      saveClients(updatedClients);
    } catch (err) {
      setError('Error al actualizar cliente');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const updatedClients = clients.filter(client => client.id !== id);
      saveClients(updatedClients);
    } catch (err) {
      setError('Error al eliminar cliente');
      throw err;
    }
  };

  const getClientsByStatus = (status: ClientStatus) => {
    return clients.filter(client => client.status === status);
  };

  const refetch = () => {
    const storedClients = getFromStorage(STORAGE_KEYS.CLIENTS, []);
    setClients(storedClients);
  };

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClientsByStatus,
    refetch,
  };
};