import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useClients } from '../hooks/useClients';
import TaskForm from '../components/TaskForm';
import { Task, TaskStatus, TaskPriority } from '../types';
import { TASK_PRIORITIES } from '../utils/constants';
import { formatDateTime, isOverdue } from '../utils/format';
import { 
  Plus, 
  Search, 
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Trash2
} from 'lucide-react';

const Tasks: React.FC = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { clients } = useClients();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const pending = filteredTasks.filter(t => t.status === 'pendiente');
    const completed = filteredTasks.filter(t => t.status === 'completada');
    const overdue = filteredTasks.filter(t => t.status === 'vencida' || (t.status === 'pendiente' && isOverdue(t.due_date)));
    
    return { pending, completed, overdue };
  }, [filteredTasks]);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'Sin asignar';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const isTaskOverdue = task.status === 'pendiente' && isOverdue(task.due_date);
    
    return (
      <div className={`card hover-lift ${isTaskOverdue ? 'border-red-200' : ''}`}>
        <div className="card-body">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.status === 'completada'
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 hover:border-green-500'
                }`}
              >
                {task.status === 'completada' && (
                  <CheckSquare className="w-3 h-3" />
                )}
              </button>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  task.status === 'completada' ? 'text-slate-500 line-through' : 'text-slate-900'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setShowTaskForm(true);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-600">
                {isTaskOverdue ? (
                  <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 mr-1" />
                )}
                <span className={isTaskOverdue ? 'text-red-600 font-medium' : ''}>
                  {formatDateTime(task.due_date)}
                </span>
              </div>
              {task.client_id && (
                <div className="flex items-center text-slate-600">
                  <User className="w-4 h-4 mr-1" />
                  <span>{getClientName(task.client_id)}</span>
                </div>
              )}
            </div>
            <span className={`status-badge priority-${task.priority}`}>
              {TASK_PRIORITIES.find(p => p.value === task.priority)?.label}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="loading-skeleton h-8 w-32"></div>
          <div className="loading-skeleton h-10 w-32"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card">
              <div className="card-body space-y-3">
                <div className="loading-skeleton h-6 w-3/4"></div>
                <div className="loading-skeleton h-4 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
          <p className="text-slate-600 mt-1">
            Gestiona tus tareas y recordatorios
          </p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{tasksByStatus.pending.length}</div>
              <div className="metric-label">Pendientes</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{tasksByStatus.completed.length}</div>
              <div className="metric-label">Completadas</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{tasksByStatus.overdue.length}</div>
              <div className="metric-label">Vencidas</div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="form-select min-w-[120px]"
          >
            <option value="all">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="completada">Completadas</option>
            <option value="vencida">Vencidas</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
            className="form-select min-w-[120px]"
          >
            <option value="all">Todas las prioridades</option>
            {TASK_PRIORITIES.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <div className="text-sm text-slate-600">
        Mostrando {filteredTasks.length} de {tasks.length} tareas
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks
            .sort((a, b) => {
              // Sort by status (pending first), then by due date
              if (a.status !== b.status) {
                if (a.status === 'pendiente') return -1;
                if (b.status === 'pendiente') return 1;
                if (a.status === 'vencida') return -1;
                if (b.status === 'vencida') return 1;
              }
              return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
            })
            .map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CheckSquare className="w-12 h-12" />
          </div>
          <h3 className="empty-state-title">No se encontraron tareas</h3>
          <p className="empty-state-description">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primera tarea'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Tarea
            </button>
          )}
        </div>
      )}

      {/* Task Form */}
      {showTaskForm && (
        <TaskForm
          task={editingTask || undefined}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Tasks;