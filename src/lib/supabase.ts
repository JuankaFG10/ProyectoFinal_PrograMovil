import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// 🔴 Reemplaza estos valores con los de tu proyecto en supabase.com
const SUPABASE_URL = 'https://TU_URL.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

// ─── MODO MOCK ───────────────────────────────────────────────────────────────
// Cambia a false cuando tengas tus credenciales de Supabase listas.
export const MOCK_MODE = true;
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cliente simulado para pruebas de navegación sin API
const mockVisits = [
  { id: '1', name: 'Ana Garcia', id_number: '2134 56789 0101', house: 'A-1', reason: 'Visita familiar', status: 'approved', created_at: new Date().toISOString() },
  { id: '2', name: 'Luis Pérez', id_number: '3001 12345 6789', house: 'B-12', reason: 'Entrega de paquete', status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', name: 'María López', id_number: '1590 00011 2233', house: 'C-5', reason: 'Técnico de internet', status: 'denied', created_at: new Date(Date.now() - 7200000).toISOString() },
];

export const mockSupabase = {
  from: (table: string) => ({
    select: (_cols?: string, _opts?: any) => ({
      order: (_col: string, _opts?: any) => ({
        limit: (_n: number) => Promise.resolve({ data: mockVisits, error: null }),
        then: (resolve: any) => resolve({ data: mockVisits, error: null }),
      }),
      eq: (_col: string, _val: any) => ({
        single: () => Promise.resolve({ data: mockVisits[0], error: null }),
      }),
      gte: (_col: string, _val: any) => ({
        then: (resolve: any) => resolve({ data: mockVisits.slice(0, 1), count: 1, error: null }),
      }),
      then: (resolve: any) => resolve({ data: mockVisits, count: mockVisits.length, error: null }),
    }),
    insert: (_data: any) => ({
      select: () => ({
        single: () => {
          const newVisit = { id: Math.random().toString(36).slice(2), ...(_data[0] || _data), created_at: new Date().toISOString() };
          return Promise.resolve({ data: newVisit, error: null });
        },
      }),
    }),
    update: (_data: any) => ({
      eq: (_col: string, _val: any) => Promise.resolve({ error: null }),
    }),
    delete: () => ({
      eq: (_col: string, _val: any) => Promise.resolve({ error: null }),
    }),
  }),
};
