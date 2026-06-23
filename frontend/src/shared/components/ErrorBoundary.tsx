import { Component, type ReactNode } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';

// Fallback funcional para poder usar i18n (los class components no tienen hooks).
function ErrorFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('error.title')}</h1>
      <p className="text-gray-500 max-w-md">{t('error.message')}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 inline-flex items-center gap-2 bg-coope-green-600 hover:bg-coope-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
      >
        {t('error.reload')}
      </button>
    </div>
  );
}

// Error boundary: evita la pantalla en blanco si un componente revienta en runtime.
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

export default ErrorBoundary;
