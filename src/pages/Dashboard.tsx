import React from 'react';
import { useClients } from '../hooks/useClients';
import { useTasks } from '../hooks/useTasks';
import { formatCurrency } from '../utils/format';
import { CLIENT_STATUSES } from '../utils/constants';
import { 
  Users, 
  DollarSign, 
  CheckSquare, 
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUp,
  Calendar,
  Star,
  Zap,
  Target,
  Award,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();

  if (clientsLoading || tasksLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="metric-card">
              <div className="loading-skeleton h-10 w-24 mb-3"></div>
              <div className="loading-skeleton h-5 w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalValue = clients.reduce((sum, client) => sum + (client.estimated_value || 0), 0);
  const pendingTasks = tasks.filter(task => task.status === 'pendiente').length;
  const overdueTasks = tasks.filter(task => task.status === 'vencida').length;
  
  const closedClients = clients.filter(c => c.status === 'cerrado').length;
  const totalClients = clients.length;
  const conversionRate = totalClients > 0 ? (closedClients / totalClients) * 100 : 0;

  const clientsByStatus = CLIENT_STATUSES.map(status => ({
    ...status,
    count: clients.filter(c => c.status === status.value).length,
    percentage: totalClients > 0 ? (clients.filter(c => c.status === status.value).length / totalClients) * 100 : 0
  }));

  const recentClients = clients
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => task.status === 'pendiente')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header con saludo */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">¡Bienvenido de vuelta! 👋</h1>
            <p className="text-xl text-blue-100">
              Aquí tienes un resumen de tu actividad empresarial
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-10 h-10 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-blue-600">{totalClients}</div>
              <div className="metric-label">Total Clientes</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="font-semibold">+12% este mes</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-green-600">{formatCurrency(totalValue)}</div>
              <div className="metric-label">Valor Pipeline</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="font-semibold">+8% este mes</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-orange-600">{pendingTasks}</div>
              <div className="metric-label">Tareas Pendientes</div>
              {overdueTasks > 0 && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{overdueTasks} vencidas</span>
                </div>
              )}
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-purple-600">{conversionRate.toFixed(1)}%</div>
              <div className="metric-label">Tasa Conversión</div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="font-semibold">+5% este mes</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pipeline de ventas */}
        <div className="xl:col-span-1">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pipeline de Ventas</h3>
                  <p className="text-sm text-gray-600">Distribución por estado</p>
                </div>
              </div>
            </div>
            <div className="card-body space-y-6">
              {clientsByStatus.map(status => (
                <div key={status.value} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        status.value === 'nuevo' ? 'bg-blue-500' :
                        status.value === 'interesado' ? 'bg-yellow-500' :
                        status.value === 'propuesta' ? 'bg-purple-500' :
                        status.value === 'negociacion' ? 'bg-orange-500' :
                        status.value === 'cerrado' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-semibold text-gray-700">{status.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-900">{status.count}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {status.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        status.value === 'nuevo' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        status.value === 'interesado' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        status.value === 'propuesta' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                        status.value === 'negociacion' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                        status.value === 'cerrado' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clientes recientes */}
        <div className="xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Clientes Recientes</h3>
                    <p className="text-sm text-gray-600">Últimos clientes agregados</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl">
                  <Award className="w-4 h-4 mr-2" />
                  {recentClients.length} nuevos
                </div>
              </div>
            </div>
            <div className="card-body">
              {recentClients.length > 0 ? (
                <div className="space-y-4">
                  {recentClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group border border-gray-200 hover:border-blue-200">
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <span className="text-white font-bold text-lg">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{client.name}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            {client.company && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {client.company}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-1" />
                              {client.email}
                            </div>
                          </div>
                          {client.estimated_value && (
                            <p className="text-lg font-bold text-green-600 mt-2">
                              {formatCurrency(client.estimated_value)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`status-badge status-${client.status} text-sm font-semibold`}>
                          {CLIENT_STATUSES.find(s => s.value === client.status)?.label}
                        </span>
                        <p className="text-sm text-gray-500 mt-2 bg-white px-3 py-1 rounded-full">
                          {new Date(client.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Users className="empty-state-icon" />
                  <h4 className="empty-state-title">No hay clientes</h4>
                  <p className="empty-state-description">
                    Comienza agregando tu primer cliente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Próximas tareas */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Próximas Tareas</h3>
                <p className="text-sm text-gray-600">Tareas pendientes por fecha</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-orange-100 px-4 py-2 rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              {upcomingTasks.length} pendientes
            </div>
          </div>
        </div>
        <div className="card-body">
          {upcomingTasks.length > 0 ? (
            <div className="space-y-4">
              {upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-red-50 transition-all duration-300 group border border-gray-200 hover:border-orange-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                      {task.status === 'vencida' ? (
                        <AlertCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Clock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{task.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{task.description || 'Sin descripción'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`status-badge priority-${task.priority} text-sm font-semibold`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-500 mt-2 bg-white px-3 py-1 rounded-full">
                      {new Date(task.due_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <CheckSquare className="empty-state-icon" />
              <h4 className="empty-state-title">No hay tareas pendientes</h4>
              <p className="empty-state-description">
                ¡Excelente trabajo! Todas las tareas están completadas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;