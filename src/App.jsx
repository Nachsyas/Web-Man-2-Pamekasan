import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from './i18n';
import { AppRoutes } from './router';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      {/* Basename dihapus untuk standar pengembangan lokal */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;