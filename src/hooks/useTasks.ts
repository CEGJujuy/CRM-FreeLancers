import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { supabase, isMockMode } from '../lib/supabase';

// Mock data para pruebas
const mockTasks: Task[] = [
  {
    id: '1',
    client_id: '1',
    title: 'Enviar propuesta revisada',
    description: 'Incluir cambios solicitados en la reunión',
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
    description: 'Verificar si han revisado la propuesta',
    due_date: '2024-01-22T15:00:00Z',
    priority: 'media',
    status: 'vencida',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    title: 'Actualizar portfolio',
    description: 'Agregar últimos proyectos completados',
    due_date: '2024-01-30T12:00:00Z',
    priority: 'baja',
    status: 'pendiente',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
  },
];

export const useTasks = (clientId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      if (isMockMode) {
        setTimeout(() => {
          let filtered = mockTasks;
          if (clientId) {
            filtered = mockTasks.filter(t => t.client_id === clientId);
          }
          // Actualizar estado de tareas vencidas
          filtered = filtered.map(task => ({
            ...task,
            status: new Date(task.due_date) < new Date() && task.status === 'pendiente' 
              ? 'vencida' as TaskStatus
              : task.status
          }));
          setTasks(filtered);
          setLoading(false);
        }, 300);
        return;
      }

      let query = supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas');
      // Fallback a datos mock
      let filtered = mockTasks;
      if (clientId) {
        filtered = mockTasks.filter(t => t.client_id === clientId);
      }
      setTasks(filtered);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (isMockMode) {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setTasks(prev => [newTask, ...prev]);
        return newTask;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tarea');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      if (isMockMode) {
        setTasks(prev => prev.map(task => 
          task.id === id 
            ? { ...task, ...updates, updated_at: new Date().toISOString() }
            : task
        ));
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (isMockMode) {
        setTasks(prev => prev.filter(task => task.id !== id));
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tarea');
      throw err;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'completada' ? 'pendiente' : 'completada';
    await updateTask(id, { status: newStatus });
  };

  useEffect(() => {
    fetchTasks();
  }, [clientId]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refetch: fetchTasks,
  };
};