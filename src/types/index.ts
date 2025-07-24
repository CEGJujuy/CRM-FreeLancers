export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ClientStatus;
  tags: string[];
  estimated_value?: number;
  source: ClientSource;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ClientStatus = 'nuevo' | 'interesado' | 'propuesta' | 'negociacion' | 'cerrado' | 'perdido';

export type ClientSource = 'linkedin' | 'instagram' | 'facebook' | 'email' | 'referido' | 'web' | 'otro';

export interface Interaction {
  id: string;
  client_id: string;
  type: InteractionType;
  description: string;
  date: string;
  created_at: string;
}

export type InteractionType = 'email' | 'llamada' | 'reunion' | 'propuesta' | 'seguimiento';

export interface Task {
  id: string;
  client_id?: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'pendiente' | 'completada' | 'vencida';

export interface DashboardMetrics {
  totalClients: number;
  totalValue: number;
  pendingTasks: number;
  conversionRate: number;
  clientsByStatus: Record<ClientStatus, number>;
}