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
  Crown,
  Zap,
  Heart,
  Sparkles
} from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const statusConfig = CLIENT_STATUSES.find(s => s.value === client.status);

  return (
    <div 
      className="card card-hover-effect group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl"
      onClick={onClick}
    >
      {/* Header con gradiente vibrante */}
      <div className="h-3 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600"></div>
      
      <div className="card-body bg-gradient-to-br from-white to-purple-50/20">
        {/* Avatar y info principal con colores */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-18 h-18 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <span className="text-white font-black text-2xl">
                  {getInitials(client.name)}
                </span>
              </div>
              {client.status === 'cerrado' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              )}
              {client.status === 'nuevo' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <h3 className="font-black text-2xl text-slate-900 group-hover:gradient-text transition-all duration-300">
                {client.name}
              </h3>
              {client.company && (
                <p className="text-slate-600 flex items-center mt-2 font-semibold text-lg">
                  <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                  {client.company}
                </p>
              )}
            </div>
          </div>
          {statusConfig && (
            <div className="relative">
              <span className={`status-badge status-${client.status} shadow-xl text-lg font-black`}>
                {statusConfig.label}
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Información de contacto con iconos coloridos */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-slate-600 hover:text-purple-700 transition-colors p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center text-slate-600 hover:text-green-700 transition-colors p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">{client.phone}</span>
            </div>
          )}
        </div>

        {/* Valor y fecha con diseño premium */}
        <div className="flex items-center justify-between mb-6 p-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-black gradient-text-success">
                {client.estimated_value ? formatCurrency(client.estimated_value) : 'Sin valor'}
              </p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Valor estimado</p>
            </div>
          </div>
          <div className="flex items-center text-right">
            <div className="mr-4">
              <p className="text-lg font-black text-slate-700">
                {formatDate(client.created_at)}
              </p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Creado</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Etiquetas con colores vibrantes */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {client.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-black bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-2 border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Tag className="w-4 h-4 mr-2 text-purple-600" />
                {tag}
              </span>
            ))}
            {client.tags.length > 3 && (
              <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-black bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-2 border-slate-300 shadow-lg">
                <Zap className="w-4 h-4 mr-2 text-orange-500" />
                +{client.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Fuente con diseño premium */}
        <div className="pt-6 border-t-2 border-gradient-to-r from-purple-100 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-bold text-slate-600 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-2xl shadow-lg">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              <span className="capitalize">Fuente: {client.source}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;