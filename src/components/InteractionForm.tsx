import React, { useState } from 'react';
import { Interaction, InteractionType } from '../types';
import { INTERACTION_TYPES } from '../utils/constants';
import { X } from 'lucide-react';

interface InteractionFormProps {
  clientId: string;
  onSubmit: (data: Omit<Interaction, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

const InteractionForm: React.FC<InteractionFormProps> = ({ clientId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'email' as InteractionType,
    description: '',
    date: new Date().toISOString().slice(0, 16), // Format for datetime-local input
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      client_id: clientId,
      type: formData.type,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
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
            Nueva Interacción
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
              Tipo de Interacción
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              {INTERACTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="form-textarea"
              placeholder="Describe qué se discutió o acordó en esta interacción..."
            />
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
              Guardar Interacción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InteractionForm;