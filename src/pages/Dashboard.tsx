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
  Zap,
  Star,
  Trophy,
  Rocket,
  Crown,
  Sparkles,
  Heart,
  Gift
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();

  if (clientsLoading || tasksLoading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="metric-card">
              <div className="loading-skeleton h-10 w-20 mb-3"></div>
              <div className="loading-skeleton h-6 w-32"></div>
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
    .slice(0, 6);

  const weeklyGrowth = clients.filter(c => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(c.created_at) > weekAgo;
  }).length;

  return (
    <div className="space-y-10">
      {/* Header Premium con saludo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative">
            <h1 className="text-5xl font-black mb-4">
              <span className="gradient-text">¡Bienvenido de vuelta!</span>
              <span className="ml-3 text-4xl">🚀</span>
            </h1>
            <p className="text-xl font-semibold text-slate-600 mb-2">
              Tu imperio freelance está creciendo increíblemente
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full border-2 border-emerald-200 shadow-lg">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                <span className="font-bold">Sistema funcionando perfectamente</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full border-2 border-purple-200 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-bold">Datos actualizados</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 lg:mt-0 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-2xl border-2 border-orange-200 shadow-xl">
              <Trophy className="w-6 h-6 mr-3 text-yellow-600" />
              <span className="font-black text-lg">¡Nivel Pro Activo!</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-500">Última actualización</p>
            <p className="text-lg font-bold gradient-text">Hace 2 minutos</p>
          </div>
        </div>
      </div>

      {/* Métricas Premium con colores vibrantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="metric-card group shadow-blue">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-6xl">{totalClients}</div>
              <div className="metric-label text-lg">Total Clientes</div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <ArrowUp className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-lg font-black text-emerald-600">+{weeklyGrowth} esta semana</span>
            </div>
            <Rocket className="w-6 h-6 text-blue-500 animate-bounce-custom" />
          </div>
        </div>

        <div className="metric-card group shadow-green">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-6xl gradient-text-success">{formatCurrency(totalValue)}</div>
              <div className="metric-label text-lg">Valor Pipeline</div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-emerald-500 to-teal-600 shadow-green">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-lg font-black text-slate-600">Oportunidades activas</span>
            </div>
            <Star className="w-6 h-6 text-yellow-500 animate-pulse-custom" />
          </div>
        </div>

        <div className="metric-card group shadow-purple">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-6xl gradient-text-warning">{pendingTasks}</div>
              <div className="metric-label text-lg">Tareas Pendientes</div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-amber-500 to-orange-600 shadow-red">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          {overdueTasks > 0 ? (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-lg font-black text-red-600">{overdueTasks} vencidas</span>
              </div>
              <Gift className="w-6 h-6 text-red-500 animate-bounce" />
            </div>
          ) : (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-lg font-black text-emerald-600">¡Todo al día!</span>
              </div>
              <Zap className="w-6 h-6 text-green-500 animate-pulse" />
            </div>
          )}
        </div>

        <div className="metric-card group shadow-purple">
          <div className="flex items-center justify-between">
            <div>
              <div className="metric-value text-6xl">{conversionRate.toFixed(1)}%</div>
              <div className="metric-label text-lg">Tasa Conversión</div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <ArrowUp className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-lg font-black text-emerald-600">{closedClients} cerrados</span>
            </div>
            <Crown className="w-6 h-6 text-purple-500 animate-pulse-custom" />
          </div>
        </div>
      </div>

      {/* Gráficos y listas con diseño premium */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Distribución por estado con colores vibrantes */}
        <div className="xl:col-span-1">
          <div className="card card-gradient shadow-purple">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black gradient-text">Pipeline de Ventas</h3>
                  <p className="text-sm font-bold text-purple-600 mt-2">Distribución por estado</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="card-body space-y-6">
              {clientsByStatus.map(status => (
                <div key={status.value} className="group hover-glow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-4 shadow-lg ${
                        status.value === 'nuevo' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        status.value === 'interesado' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        status.value === 'propuesta' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        status.value === 'negociacion' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        status.value === 'cerrado' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}></div>
                      <span className="text-lg font-black text-slate-700">{status.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-black text-slate-900">{status.count}</span>
                      <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        {status.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 shadow-lg ${
                        status.value === 'nuevo' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        status.value === 'interesado' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        status.value === 'propuesta' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        status.value === 'negociacion' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        status.value === 'cerrado' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clientes recientes con diseño premium */}
        <div className="xl:col-span-2">
          <div className="card card-gradient shadow-blue">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black gradient-text">Actividad Reciente</h3>
                  <p className="text-sm font-bold text-blue-600 mt-2">Últimos clientes agregados</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="card-body">
              {recentClients.length > 0 ? (
                <div className="space-y-6">
                  {recentClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-purple-50/30 rounded-2xl hover:from-purple-50 hover:to-blue-50 transition-all duration-500 group shadow-lg hover:shadow-xl hover:-translate-y-1">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                            <span className="text-white font-black text-xl">
                              {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-xl text-slate-900 group-hover:gradient-text transition-all duration-300">
                            {client.name}
                          </p>
                          <p className="text-lg font-semibold text-slate-600">{client.company || client.email}</p>
                          {client.estimated_value && (
                            <p className="text-sm font-black gradient-text-success">
                              {formatCurrency(client.estimated_value)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`status-badge status-${client.status} text-lg font-bold shadow-lg`}>
                          {CLIENT_STATUSES.find(s => s.value === client.status)?.label}
                        </span>
                        <p className="text-sm font-bold text-slate-500 mt-2">
                          {new Date(client.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state py-12">
                  <Users className="empty-state-icon" />
                  <h4 className="empty-state-title">¡Comienza tu aventura!</h4>
                  <p className="empty-state-description">
                    Agrega tu primer cliente y construye tu imperio
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Próximas tareas con diseño premium */}
      <div className="card card-gradient shadow-green">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black gradient-text">Próximas Tareas</h3>
              <p className="text-sm font-bold text-green-600 mt-2">Mantente al día con tus compromisos</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-black gradient-text">{upcomingTasks.length}</p>
                <p className="text-sm font-bold text-slate-600">Pendientes</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {upcomingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-6 bg-gradient-to-br from-white to-green-50/30 rounded-2xl hover:from-green-50 hover:to-blue-50 transition-all duration-500 group shadow-lg hover:shadow-xl hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {task.status === 'vencida' ? (
                        <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 animate-pulse" />
                      ) : (
                        <Clock className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0" />
                      )}
                      <span className={`status-badge priority-${task.priority} font-bold shadow-lg`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <Sparkles className="w-5 h-5 text-yellow-500 group-hover:animate-spin" />
                  </div>
                  <h4 className="font-black text-xl text-slate-900 mb-3 group-hover:gradient-text transition-all duration-300">
                    {task.title}
                  </h4>
                  <p className="text-lg font-semibold text-slate-600 mb-4 line-clamp-2">
                    {task.description || 'Sin descripción'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
                    </span>
                    <span className="font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
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
            <div className="empty-state py-12">
              <CheckSquare className="empty-state-icon" />
              <h4 className="empty-state-title">¡Increíble trabajo! 🎉</h4>
              <p className="empty-state-description">
                No tienes tareas pendientes. ¡Eres una máquina de productividad!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;