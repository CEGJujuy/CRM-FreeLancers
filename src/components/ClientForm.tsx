import React, { useState } from 'react';
import { Client, ClientStatus, ClientSource } from '../types';
import { CLIENT_STATUSES, CLIENT_SOURCES } from '../utils/constants';
import { X } from 'lucide-react';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    status: client?.status || 'nuevo' as ClientStatus,
    tags: client?.tags?.join(', ') || '',
    estimated_value: client?.estimated_value?.toString() || '',
    source: client?.source || 'web' as ClientSource,
    notes: client?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      status: formData.status,
      tags,
      estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : undefined,
      source: formData.source,
      notes: formData.notes || undefined,
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
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+34 600 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre de la empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                {CLIENT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fuente
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="form-select"
              >
                {CLIENT_SOURCES.map(source => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Valor Estimado (€)
              </label>
              <input
                type="number"
                name="estimated_value"
                value={formData.estimated_value}
                onChange={handleChange}
                className="form-input"
                placeholder="5000"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Etiquetas
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="web, ecommerce, react"
              />
              <p className="text-xs text-slate-500 mt-1">
                Separar con comas
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Notas adicionales sobre el cliente..."
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
              {client ? 'Actualizar' : 'Crear'} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;