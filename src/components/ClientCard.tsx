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
  MapPin,
  Star,
  Zap,
  Crown
} from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const statusConfig = CLIENT_STATUSES.find(s => s.value === client.status);
  const isVip = client.estimated_value && client.estimated_value > 10000;

  return (
    <div 
      className="card cursor-pointer hover-lift group relative overflow-hidden"
      onClick={onClick}
    >
      {/* VIP Badge */}
      {isVip && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className="card-body">
        {/* Header con avatar y estado */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">
                {getInitials(client.name)}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl">{client.name}</h3>
              {client.company && (
                <p className="text-sm text-gray-600 flex items-center mt-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  {client.company}
                </p>
              )}
            </div>
          </div>
          {statusConfig && (
            <span className={`status-badge status-${client.status} font-semibold`}>
              {statusConfig.label}
            </span>
          )}
        </div>

        {/* Información de contacto */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <Mail className="w-5 h-5 mr-3 text-blue-600" />
            <span className="font-medium">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center text-sm text-gray-600 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <Phone className="w-5 h-5 mr-3 text-green-600" />
              <span className="font-medium">{client.phone}</span>
            </div>
          )}
        </div>

        {/* Valor y fecha */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-green-600 text-lg">
                {client.estimated_value ? formatCurrency(client.estimated_value) : 'Sin valor'}
              </span>
              <p className="text-xs text-gray-500">Valor estimado</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <div className="text-right">
              <p className="font-medium">{formatDate(client.created_at)}</p>
              <p className="text-xs">Agregado</p>
            </div>
          </div>
        </div>

        {/* Etiquetas */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {client.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300">
                +{client.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Fuente */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="capitalize font-medium">Fuente: {client.source}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-semibold text-gray-700">Cliente</span>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default ClientCard;