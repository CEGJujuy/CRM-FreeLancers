// Utilidades para manejo de localStorage
export const STORAGE_KEYS = {
  CLIENTS: 'crm_clients',
  INTERACTIONS: 'crm_interactions',
  TASKS: 'crm_tasks',
} as const;

// Función genérica para obtener datos del localStorage
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Función genérica para guardar datos en localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// Función para limpiar todos los datos del CRM
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Función para exportar todos los datos
export const exportData = () => {
  const data = {
    clients: getFromStorage(STORAGE_KEYS.CLIENTS, []),
    interactions: getFromStorage(STORAGE_KEYS.INTERACTIONS, []),
    tasks: getFromStorage(STORAGE_KEYS.TASKS, []),
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Función para generar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};