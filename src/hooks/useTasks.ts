import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { getFromStorage, saveToStorage, generateId, STORAGE_KEYS } from '../lib/localStorage';

// Datos iniciales para el primer uso
const initialTasks: Task[] = [
  {
    id: '1',
    client_id: '1',
    title: 'Enviar propuesta revisada',
    description: 'Incluir cambios solicitados en la reunión: integración con Stripe y diseño responsive',
    due_date: '2024-01-25T10:00:00Z',
    priority: 'alta',
    status: 'pendiente',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    client_id: '2',
    title: 'Llamar para seguimiento',
    description: 'Verificar si han revisado la propuesta de la app móvil y resolver dudas técnicas',
    due_date: '2024-01-22T15:00:00Z',
    priority: 'media',
    status: 'vencida',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    title: 'Actualizar portfolio',
    description: 'Agregar últimos proyectos completados y testimonios de clientes',
    due_date: '2024-01-30T12:00:00Z',
    priority: 'baja',
    status: 'pendiente',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '4',
    client_id: '3',
    title: 'Preparar moodboard',
    description: 'Crear moodboard con referencias visuales para el proyecto de branding',
    due_date: '2024-01-26T14:00:00Z',
    priority: 'alta',
    status: 'pendiente',
    created_at: '2024-01-21T09:00:00Z',
    updated_at: '2024-01-21T09:00:00Z',
  },
  {
    id: '5',
    client_id: '4',
    title: 'Análisis de competencia',
    description: 'Investigar tiendas online similares para proponer mejores prácticas',
    due_date: '2024-01-24T16:00:00Z',
    priority: 'media',
    status: 'completada',
    created_at: '2024-01-19T11:00:00Z',
    updated_at: '2024-01-23T14:30:00Z',
  },
  {
    id: '6',
    title: 'Renovar certificados SSL',
    description: 'Renovar certificados de seguridad para todos los sitios web en hosting',
    due_date: '2024-01-28T09:00:00Z',
    priority: 'alta',
    status: 'pendiente',
    created_at: '2024-01-20T15:00:00Z',
    updated_at: '2024-01-20T15:00:00Z',
  },
];

export const useTasks = (clientId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tareas del localStorage al inicializar
  useEffect(() => {
    try {
      setLoading(true);
      const storedTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
      
      // Si no hay tareas guardadas, usar datos iniciales
      if (storedTasks.length === 0) {
        // Actualizar estado de tareas vencidas
        const tasksWithUpdatedStatus = initialTasks.map(task => ({
          ...task,
          status: new Date(task.due_date) < new Date() && task.status === 'pendiente' 
            ? 'vencida' as TaskStatus
            : task.status
        }));
        setTasks(tasksWithUpdatedStatus);
        saveToStorage(STORAGE_KEYS.TASKS, tasksWithUpdatedStatus);
      } else {
        // Actualizar estado de tareas vencidas en datos existentes
        const tasksWithUpdatedStatus = storedTasks.map((task: Task) => ({
          ...task,
          status: new Date(task.due_date) < new Date() && task.status === 'pendiente' 
            ? 'vencida' as TaskStatus
            : task.status
        }));
        setTasks(tasksWithUpdatedStatus);
      }
    } catch (err) {
      setError('Error al cargar tareas');
      setTasks(initialTasks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar por cliente si se especifica
  const filteredTasks = clientId 
    ? tasks.filter(t => t.client_id === clientId)
    : tasks;

  // Guardar tareas en localStorage
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveToStorage(STORAGE_KEYS.TASKS, newTasks);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updatedTasks = [newTask, ...tasks];
      saveTasks(updatedTasks);
      return newTask;
    } catch (err) {
      setError('Error al crear tarea');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      );
      saveTasks(updatedTasks);
    } catch (err) {
      setError('Error al actualizar tarea');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
    } catch (err) {
      setError('Error al eliminar tarea');
      throw err;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'completada' ? 'pendiente' : 'completada';
    await updateTask(id, { status: newStatus });
  };

  const refetch = () => {
    const storedTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    setTasks(storedTasks);
  };

  return {
    tasks: filteredTasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refetch,
  };
};