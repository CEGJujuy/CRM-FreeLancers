import React from 'react';
import { Client } from '../types';
import { formatCurrency, formatDate, getInitials } from '../utils/format';
import { CLIENT_STATUSES } from '../utils/constants';
import { 
  Mail, 
  Phone, 
  Building2, 
  Tag, 
  DollarSign, 
  Calendar, 
  MapPin
} from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const statusConfig = CLIENT_STATUSES.find(s => s.value === client.status);

  return (
    <div 
      className="card cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body">
        {/* Header con avatar y estado */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-semibold">
                {getInitials(client.name)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{client.name}</h3>
              {client.company && (
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
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

        {/* Información de contacto */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {client.email}
          </div>
          {client.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {client.phone}
            </div>
          )}
        </div>

        {/* Valor y fecha */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-semibold text-green-600">
              {client.estimated_value ? formatCurrency(client.estimated_value) : 'Sin valor'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(client.created_at)}
          </div>
        </div>

        {/* Etiquetas */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {client.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                +{client.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Fuente */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="capitalize">Fuente: {client.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;