import React, { createContext, useContext, useState } from 'react';
import { I18n } from 'i18n-js';

const translations = {
  es: {
    // General
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    save: 'Guardar',
    cancel: 'Cancelar',
    error: 'Error',
    // Home
    today: 'Hoy',
    total: 'Total',
    quickActions: 'Acciones Rápidas',
    registerVisit: 'Registrar Visita',
    scanQR: 'Escanear QR',
    // Visitors
    visitors: 'Visitantes',
    newVisitor: '+ Nuevo',
    noVisits: 'No hay visitas registradas aún.',
    // History
    visitHistory: 'Historial de Visitas',
    noHistory: 'Sin historial disponible.',
    approved: '✓ Aprobado',
    pending: '⏳ Pendiente',
    // Profile
    profile: 'Perfil',
    language: 'Idioma',
    // Login
    email: 'Correo Electrónico',
    password: 'Contraseña',
    noAccount: '¿No tienes cuenta? Regístrate',
    appSubtitle: 'Control de acceso residencial',
    // Register Visit
    completeData: 'Completa los datos del visitante',
    fullName: 'Nombre Completo *',
    idNumber: 'DPI / Identificación *',
    house: 'Casa / Lote *',
    visitReason: 'Motivo de visita',
    registerAndQR: 'Registrar y Generar QR',
    visitRegistered: '✅ Visita Registrada',
    qrAccess: 'Código QR de acceso para',
    done: 'Listo',
  },
  en: {
    // General
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    error: 'Error',
    // Home
    today: 'Today',
    total: 'Total',
    quickActions: 'Quick Actions',
    registerVisit: 'Register Visit',
    scanQR: 'Scan QR',
    // Visitors
    visitors: 'Visitors',
    newVisitor: '+ New',
    noVisits: 'No visits registered yet.',
    // History
    visitHistory: 'Visit History',
    noHistory: 'No history available.',
    approved: '✓ Approved',
    pending: '⏳ Pending',
    // Profile
    profile: 'Profile',
    language: 'Language',
    // Login
    email: 'Email',
    password: 'Password',
    noAccount: "Don't have an account? Register",
    appSubtitle: 'Residential access control',
    // Register Visit
    completeData: 'Complete visitor information',
    fullName: 'Full Name *',
    idNumber: 'ID / Passport *',
    house: 'House / Lot *',
    visitReason: 'Visit reason',
    registerAndQR: 'Register and Generate QR',
    visitRegistered: '✅ Visit Registered',
    qrAccess: 'QR access code for',
    done: 'Done',
  },
};

const i18n = new I18n(translations);

interface LanguageContextType {
  locale: string;
  setLocale: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState('es');

  const setLocale = (lang: string) => {
    i18n.locale = lang;
    setLocaleState(lang);
  };

  const t = (key: string) => i18n.t(key);

  i18n.locale = locale;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);