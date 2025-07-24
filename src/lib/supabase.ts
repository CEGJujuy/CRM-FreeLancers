import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data para entorno de prueba cuando no hay Supabase configurado
export const isMockMode = !import.meta.env.VITE_SUPABASE_URL || supabaseUrl === 'https://demo.supabase.co';