import React from 'react';
import { Client } from '../types';
import { formatCurrency, formatDate, getInitials } from '../utils/format';
import { CLIENT_STATUSES } from '../utils/constants';
import { Mail, Phone, Building2, Tag, DollarSign, Calendar } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const statusConfig = CLIENT_STATUSES.find(s => s.value === client.status);

  return (
    <div 
      className="card hover-lift cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-semibold text-sm">
                {getInitials(client.name)}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-slate-900">{client.name}</h3>
              {client.company && (
                <p className="text-sm text-slate-600 flex items-center mt-1">
                  <Building2 className="w-3 h-3 mr-1" />
                  {client.company}
                </p>
              )}
            </div>
          </div>
          {statusConfig && (
            <span className={`status-badge status-${client.status}`}>
              {statusConfig.label}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <Mail className="w-4 h-4 mr-2" />
            {client.email}
          </div>
          {client.phone && (
            <div className="flex items-center text-sm text-slate-600">
              <Phone className="w-4 h-4 mr-2" />
              {client.phone}
            </div>
          )}
        </div>

        {/* Value and Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-600">
            <DollarSign className="w-4 h-4 mr-1" />
            {client.estimated_value ? formatCurrency(client.estimated_value) : 'Sin valor'}
          </div>
          <div className="flex items-center text-slate-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(client.created_at)}
          </div>
        </div>

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {client.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="text-xs text-slate-500">
                +{client.tags.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCard;