import React, { useState } from 'react';
import { Task, TaskPriority } from '../types';
import { TASK_PRIORITIES } from '../utils/constants';
import { X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  clientId?: string;
  onSubmit: (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, clientId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
    priority: task?.priority || 'media' as TaskPriority,
    client_id: task?.client_id || clientId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      due_date: new Date(formData.due_date).toISOString(),
      priority: formData.priority,
      status: task?.status || 'pendiente',
      client_id: formData.client_id || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Título de la tarea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Descripción opcional de la tarea..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha Límite *
              </label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                {TASK_PRIORITIES.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {task ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;