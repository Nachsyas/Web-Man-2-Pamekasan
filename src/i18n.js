import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: { welcome: "Selamat Datang" } }
    },
    lng: "id", 
    fallbackLng: "id",
    interpolation: { escapeValue: false }
  });

export default i18n;