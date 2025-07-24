import React, { useState, useMemo } from 'react';
import { useClients } from '../hooks/useClients';
import { useInteractions } from '../hooks/useInteractions';
import { useTasks } from '../hooks/useTasks';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import InteractionForm from '../components/InteractionForm';
import TaskForm from '../components/TaskForm';
import { Client, ClientStatus } from '../types';
import { CLIENT_STATUSES } from '../utils/constants';
import { formatDateTime } from '../utils/format';
import { 
  Plus, 
  Search, 
  Filter,
  MessageSquare,
  CheckSquare,
  X,
  Mail,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();
  const { interactions, addInteraction } = useInteractions();
  const { tasks, addTask } = useTasks();

  const [showClientForm, setShowClientForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [showClientDetail, setShowClientDetail] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addClient(clientData);
      setShowClientForm(false);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleUpdateClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingClient) return;
    
    try {
      await updateClient(editingClient.id, clientData);
      setEditingClient(null);
      setShowClientForm(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleAddInteraction = async (interactionData: any) => {
    try {
      await addInteraction(interactionData);
      setShowInteractionForm(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await addTask(taskData);
      setShowTaskForm(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const clientInteractions = selectedClient 
    ? interactions.filter(i => i.client_id === selectedClient.id)
    : [];

  const clientTasks = selectedClient 
    ? tasks.filter(t => t.client_id === selectedClient.id)
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="loading-skeleton h-8 w-32"></div>
          <div className="loading-skeleton h-10 w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card">
              <div className="card-body space-y-3">
                <div className="loading-skeleton h-6 w-3/4"></div>
                <div className="loading-skeleton h-4 w-1/2"></div>
                <div className="loading-skeleton h-4 w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-1">
            Gestiona tu cartera de clientes potenciales
          </p>
        </div>
        <button
          onClick={() => setShowClientForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
            className="form-select min-w-[150px]"
          >
            <option value="all">Todos los estados</option>
            {CLIENT_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <div className="text-sm text-slate-600">
        Mostrando {filteredClients.length} de {clients.length} clientes
      </div>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div key={client.id} className="relative group">
              <ClientCard 
                client={client} 
                onClick={() => {
                  setSelectedClient(client);
                  setShowClientDetail(true);
                }}
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClient(client);
                    setShowClientForm(true);
                  }}
                  className="p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search className="w-12 h-12" />
          </div>
          <h3 className="empty-state-title">No se encontraron clientes</h3>
          <p className="empty-state-description">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer cliente'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowClientForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Cliente
            </button>
          )}
        </div>
      )}

      {/* Client Detail Modal */}
      {showClientDetail && selectedClient && (
        <div className="modal-overlay" onClick={() => setShowClientDetail(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedClient.name}
              </h2>
              <button
                onClick={() => setShowClientDetail(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm">{selectedClient.email}</span>
                  </div>
                  {selectedClient.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                  )}
                  {selectedClient.company && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{selectedClient.company}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <span className={`status-badge status-${selectedClient.status}`}>
                    {CLIENT_STATUSES.find(s => s.value === selectedClient.status)?.label}
                  </span>
                  {selectedClient.estimated_value && (
                    <div className="text-sm">
                      <span className="font-medium">Valor estimado: </span>
                      €{selectedClient.estimated_value.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowInteractionForm(true);
                    setShowClientDetail(false);
                  }}
                  className="btn-secondary"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nueva Interacción
                </button>
                <button
                  onClick={() => {
                    setShowTaskForm(true);
                    setShowClientDetail(false);
                  }}
                  className="btn-secondary"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </button>
              </div>

              {/* Interactions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Historial de Interacciones
                </h3>
                {clientInteractions.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {clientInteractions.map(interaction => (
                      <div key={interaction.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize">
                            {interaction.type}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDateTime(interaction.date)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{interaction.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No hay interacciones registradas</p>
                )}
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Tareas Relacionadas
                </h3>
                {clientTasks.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {clientTasks.map(task => (
                      <div key={task.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`status-badge priority-${task.priority}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-sm text-slate-700">{task.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No hay tareas asignadas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showClientForm && (
        <ClientForm
          client={editingClient || undefined}
          onSubmit={editingClient ? handleUpdateClient : handleAddClient}
          onCancel={() => {
            setShowClientForm(false);
            setEditingClient(null);
          }}
        />
      )}

      {showInteractionForm && selectedClient && (
        <InteractionForm
          clientId={selectedClient.id}
          onSubmit={handleAddInteraction}
          onCancel={() => setShowInteractionForm(false)}
        />
      )}

      {showTaskForm && selectedClient && (
        <TaskForm
          clientId={selectedClient.id}
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

export default Clients;