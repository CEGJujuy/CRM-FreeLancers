import React from 'react';
import { Client } from '../types';
import { formatCurrency, formatDate, getInitials } from '../utils/format';
import { CLIENT_STATUSES } from '../utils/constants';
import { Mail, Phone, Building2, Tag, DollarSign, Calendar, MapPin, Star } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const statusConfig = CLIENT_STATUSES.find(s => s.value === client.status);

  return (
    <div 
      className="card card-hover group cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Header con gradiente */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="card-body">
        {/* Avatar y info principal */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-slate-700 font-bold text-lg">
                  {getInitials(client.name)}
                </span>
              </div>
              {client.status === 'cerrado' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                {client.name}
              </h3>
              {client.company && (
                <p className="text-slate-600 flex items-center mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  {client.company}
                </p>
              )}
            </div>
          </div>
          {statusConfig && (
            <span className={`status-badge status-${client.status} shadow-sm`}>
              {statusConfig.label}
            </span>
          )}
        </div>

        {/* Información de contacto */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <Mail className="w-4 h-4 mr-3 text-blue-500" />
            <span className="text-sm font-medium">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <Phone className="w-4 h-4 mr-3 text-green-500" />
              <span className="text-sm font-medium">{client.phone}</span>
            </div>
          )}
        </div>

        {/* Valor y fecha */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {client.estimated_value ? formatCurrency(client.estimated_value) : 'Sin valor'}
              </p>
              <p className="text-xs text-slate-500">Valor estimado</p>
            </div>
          </div>
          <div className="flex items-center text-right">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">
                {formatDate(client.created_at)}
              </p>
              <p className="text-xs text-slate-500">Creado</p>
            </div>
          </div>
        </div>

        {/* Etiquetas */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {client.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                +{client.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Fuente */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-slate-500">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="capitalize">Fuente: {client.source}</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;