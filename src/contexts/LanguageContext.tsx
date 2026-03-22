import React, { createContext, useContext, useState } from 'react';
import { I18n } from 'i18n-js';

const translations = {
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    home: 'Inicio',
    visitors: 'Visitantes',
    history: 'Historial',
    profile: 'Perfil',
    scanQR: 'Escanear QR',
    generateQR: 'Generar QR',
    registerVisit: 'Registrar Visita',
    visitorName: 'Nombre del Visitante',
    visitorId: 'DPI / Identificación',
    house: 'Casa / Lote',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  en: {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    home: 'Home',
    visitors: 'Visitors',
    history: 'History',
    profile: 'Profile',
    scanQR: 'Scan QR',
    generateQR: 'Generate QR',
    registerVisit: 'Register Visit',
    visitorName: "Visitor's Name",
    visitorId: 'ID / Passport',
    house: 'House / Lot',
    email: 'Email',
    password: 'Password',
    save: 'Save',
    cancel: 'Cancel',
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
