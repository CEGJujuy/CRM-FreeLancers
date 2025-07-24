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
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();

  if (clientsLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="metric-card">
              <div className="loading-skeleton h-8 w-20 mb-2"></div>
              <div className="loading-skeleton h-4 w-32"></div>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen de tu actividad y métricas principales
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{totalClients}</div>
              <div className="metric-label">Total Clientes</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{formatCurrency(totalValue)}</div>
              <div className="metric-label">Valor Pipeline</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{pendingTasks}</div>
              <div className="metric-label">Tareas Pendientes</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          {overdueTasks > 0 && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {overdueTasks} vencidas
            </div>
          )}
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{conversionRate.toFixed(1)}%</div>
              <div className="metric-label">Tasa Conversión</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Distribución por estado */}
        <div className="xl:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Pipeline de Ventas</h3>
              <p className="text-sm text-gray-600">Distribución por estado</p>
            </div>
            <div className="card-body space-y-4">
              {clientsByStatus.map(status => (
                <div key={status.value}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{status.count}</span>
                      <span className="text-xs text-gray-500">{status.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status.value === 'nuevo' ? 'bg-blue-500' :
                        status.value === 'interesado' ? 'bg-yellow-500' :
                        status.value === 'propuesta' ? 'bg-purple-500' :
                        status.value === 'negociacion' ? 'bg-orange-500' :
                        status.value === 'cerrado' ? 'bg-green-500' :
                        'bg-red-500'
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
              <h3 className="text-lg font-semibold text-gray-900">Clientes Recientes</h3>
              <p className="text-sm text-gray-600">Últimos clientes agregados</p>
            </div>
            <div className="card-body">
              {recentClients.length > 0 ? (
                <div className="space-y-4">
                  {recentClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-semibold text-sm">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.company || client.email}</p>
                          {client.estimated_value && (
                            <p className="text-sm font-semibold text-green-600">
                              {formatCurrency(client.estimated_value)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`status-badge status-${client.status}`}>
                          {CLIENT_STATUSES.find(s => s.value === client.status)?.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
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
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Próximas Tareas</h3>
              <p className="text-sm text-gray-600">Tareas pendientes por fecha</p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {upcomingTasks.length} pendientes
            </div>
          </div>
        </div>
        <div className="card-body">
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {task.status === 'vencida' ? (
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description || 'Sin descripción'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`status-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
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