import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';

const NotFound = () => {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-4">
      <p className="text-7xl font-black text-coope-green-600 leading-none">404</p>
      <h1 className="text-2xl font-bold text-gray-900">{t('notfound.title')}</h1>
      <p className="text-gray-500 max-w-md">{t('notfound.message')}</p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 bg-coope-green-600 hover:bg-coope-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
      >
        {t('notfound.back')}
      </Link>
    </div>
  );
};

export default NotFound;
