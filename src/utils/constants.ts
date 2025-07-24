import { ClientStatus, ClientSource, InteractionType, TaskPriority, TaskStatus } from '../types';

export const CLIENT_STATUSES: { value: ClientStatus; label: string; color: string }[] = [
  { value: 'nuevo', label: 'Nuevo', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'interesado', label: 'Interesado', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'propuesta', label: 'Propuesta', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'negociacion', label: 'Negociación', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'cerrado', label: 'Cerrado', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'perdido', label: 'Perdido', color: 'bg-red-100 text-red-800 border-red-200' },
];

export const CLIENT_SOURCES: { value: ClientSource; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email Marketing' },
  { value: 'referido', label: 'Referido' },
  { value: 'web', label: 'Sitio Web' },
  { value: 'otro', label: 'Otro' },
];

export const INTERACTION_TYPES: { value: InteractionType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'llamada', label: 'Llamada' },
  { value: 'reunion', label: 'Reunión' },
  { value: 'propuesta', label: 'Propuesta' },
  { value: 'seguimiento', label: 'Seguimiento' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-800 border-green-200' },
];

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completada', label: 'Completada' },
  { value: 'vencida', label: 'Vencida' },
];