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
  AlertCircle
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Resumen de tu actividad comercial</p>
      </div>

      {/* Metrics Cards */}
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
          <div className="metric-change positive">
            +{clients.filter(c => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(c.created_at) > weekAgo;
            }).length} esta semana
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{formatCurrency(totalValue)}</div>
              <div className="metric-label">Valor Estimado</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="metric-change positive">
            Pipeline total
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value">{pendingTasks}</div>
              <div className="metric-label">Tareas Pendientes</div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          {overdueTasks > 0 && (
            <div className="metric-change negative">
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
          <div className="metric-change positive">
            {closedClients} cerrados
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900">Distribución por Estado</h3>
          </div>
          <div className="card-body space-y-4">
            {clientsByStatus.map(status => (
              <div key={status.value} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-300 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">{status.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">{status.count}</span>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900">Clientes Recientes</h3>
          </div>
          <div className="card-body">
            {recentClients.length > 0 ? (
              <div className="space-y-3">
                {recentClients.map(client => (
                  <div key={client.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-slate-900">{client.name}</p>
                      <p className="text-sm text-slate-600">{client.company || client.email}</p>
                    </div>
                    <span className={`status-badge status-${client.status}`}>
                      {CLIENT_STATUSES.find(s => s.value === client.status)?.label}
                    </span>
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

      {/* Upcoming Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-slate-900">Próximas Tareas</h3>
        </div>
        <div className="card-body">
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center">
                    {task.status === 'vencida' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-3" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-600">
                        Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <span className={`status-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-8">
              <CheckSquare className="empty-state-icon" />
              <h4 className="empty-state-title">No hay tareas pendientes</h4>
              <p className="empty-state-description">
                ¡Excelente! Todas las tareas están completadas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;