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
  ArrowDown,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();

  if (clientsLoading || tasksLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="metric-card">
              <div className="loading-skeleton h-8 w-16 mb-2"></div>
              <div className="loading-skeleton h-4 w-24"></div>
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

  const weeklyGrowth = clients.filter(c => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(c.created_at) > weekAgo;
  }).length;

  return (
    <div className="space-y-8">
      {/* Header con saludo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ¡Buen día! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Aquí tienes un resumen de tu actividad comercial
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <div className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
            <Zap className="w-4 h-4 mr-2" />
            <span className="font-medium">Todo actualizado</span>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card group hover:shadow-strong">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-blue-600">{totalClients}</div>
              <div className="metric-label">Total Clientes</div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+{weeklyGrowth} esta semana</span>
          </div>
        </div>

        <div className="metric-card group hover:shadow-strong">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-green-600">{formatCurrency(totalValue)}</div>
              <div className="metric-label">Valor Pipeline</div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Target className="w-4 h-4 text-slate-400 mr-1" />
            <span className="text-sm text-slate-600">Oportunidades activas</span>
          </div>
        </div>

        <div className="metric-card group hover:shadow-strong">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-amber-600">{pendingTasks}</div>
              <div className="metric-label">Tareas Pendientes</div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <CheckSquare className="w-7 h-7 text-white" />
            </div>
          </div>
          {overdueTasks > 0 ? (
            <div className="flex items-center mt-4">
              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-red-600">{overdueTasks} vencidas</span>
            </div>
          ) : (
            <div className="flex items-center mt-4">
              <Clock className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">Al día</span>
            </div>
          )}
        </div>

        <div className="metric-card group hover:shadow-strong">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-purple-600">{conversionRate.toFixed(1)}%</div>
              <div className="metric-label">Tasa Conversión</div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">{closedClients} cerrados</span>
          </div>
        </div>
      </div>

      {/* Gráficos y listas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Distribución por estado */}
        <div className="xl:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-bold text-slate-900">Pipeline de Ventas</h3>
              <p className="text-sm text-slate-600 mt-1">Distribución por estado</p>
            </div>
            <div className="card-body space-y-4">
              {clientsByStatus.map(status => (
                <div key={status.value} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        status.value === 'nuevo' ? 'bg-blue-500' :
                        status.value === 'interesado' ? 'bg-amber-500' :
                        status.value === 'propuesta' ? 'bg-purple-500' :
                        status.value === 'negociacion' ? 'bg-orange-500' :
                        status.value === 'cerrado' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-semibold text-slate-700">{status.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{status.count}</span>
                      <span className="text-xs text-slate-500">({status.percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        status.value === 'nuevo' ? 'bg-blue-500' :
                        status.value === 'interesado' ? 'bg-amber-500' :
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
              <h3 className="text-xl font-bold text-slate-900">Actividad Reciente</h3>
              <p className="text-sm text-slate-600 mt-1">Últimos clientes agregados</p>
            </div>
            <div className="card-body">
              {recentClients.length > 0 ? (
                <div className="space-y-4">
                  {recentClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-slate-700 font-bold text-sm">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{client.name}</p>
                          <p className="text-sm text-slate-600">{client.company || client.email}</p>
                          {client.estimated_value && (
                            <p className="text-xs text-green-600 font-medium">{formatCurrency(client.estimated_value)}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`status-badge status-${client.status}`}>
                          {CLIENT_STATUSES.find(s => s.value === client.status)?.label}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(client.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state py-8">
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
              <h3 className="text-xl font-bold text-slate-900">Próximas Tareas</h3>
              <p className="text-sm text-slate-600 mt-1">Mantente al día con tus compromisos</p>
            </div>
            <Calendar className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <div className="card-body">
          {upcomingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {task.status === 'vencida' ? (
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                      )}
                      <span className={`status-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {task.description || 'Sin descripción'}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
                    </span>
                    <span className="text-slate-400">
                      {new Date(task.due_date).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-8">
              <CheckSquare className="empty-state-icon" />
              <h4 className="empty-state-title">¡Excelente trabajo!</h4>
              <p className="empty-state-description">
                No tienes tareas pendientes por el momento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;