import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation, type Language } from '../../i18n/LanguageContext';
import { useCart } from '../../features/cart/CartContext';


const Navbar = () => {
  const { totalItems, toggleCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [cooperativeOpen, setCooperativeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const closeMenu = () => { setIsOpen(false); setCooperativeOpen(false); };
  const cooperativeRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Auto-hide: se esconde al bajar, reaparece al subir.
      // Umbral de 6px para ignorar micro-scroll, y siempre visible cerca del tope.
      if (Math.abs(y - lastScrollY.current) > 6) {
        setHidden(y > lastScrollY.current && y > 80);
        lastScrollY.current = y;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cooperativeRef.current && !cooperativeRef.current.contains(e.target as Node)) {
        setCooperativeOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cierra el menú al navegar (sincroniza con la ruta)
    setIsOpen(false);
    setCooperativeOpen(false);
  }, [location.pathname]);

  const cooperativeLinks = [
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.directory'), path: '/directorio' },
    { label: t('nav.transparency'), path: '/transparencia' },
  ];

  const mainLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.products'), path: '/productos' },
    { label: t('nav.map'), path: '/mapa' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.contact'), path: '/contacto' },
  ];

  const isCooperativePath = ['/about', '/directorio', '/transparencia'].includes(location.pathname);
  // El navbar es transparente (texto blanco) SOLO sobre páginas con hero oscuro.
  // En el resto (mapa, directorio, transparencia, checkout, 404…) va sólido para
  // que el texto se lea sobre fondo claro.
  const darkHero =
    location.pathname === '/' ||
    location.pathname.startsWith('/blog') ||
    ['/about', '/contacto', '/contact', '/productos', '/products'].includes(location.pathname);
  const solid = scrolled || !darkHero;
  const textColor = solid ? 'text-gray-700' : 'text-white/90';
  const activeColor = 'text-coope-green-500';

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇨🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <nav
      className={clsx(
        'fixed w-full z-50 transition-all duration-300',
        solid ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5',
        // Se oculta al bajar; si el menú móvil está abierto, siempre visible.
        hidden && !isOpen ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <span className={clsx(
            'text-xl font-bold tracking-tight transition-colors hidden sm:block',
            solid ? 'text-gray-900' : 'text-white'
          )}>
            CoopeHemp
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Inicio */}
          <Link
            to="/"
            className={clsx(
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              location.pathname === '/' ? activeColor : `${textColor} hover:text-coope-green-500`
            )}
          >
            {t('nav.home')}
          </Link>

          {/* Cooperativa Dropdown */}
          <div ref={cooperativeRef} className="relative">
            <button
              onClick={() => setCooperativeOpen(!cooperativeOpen)}
              className={clsx(
                'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isCooperativePath ? activeColor : `${textColor} hover:text-coope-green-500`
              )}
            >
              {t('nav.cooperative')}
              <ChevronDown
                size={14}
                className={clsx('transition-transform duration-200', cooperativeOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {cooperativeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden"
                >
                  {cooperativeLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={clsx(
                        'block px-4 py-2.5 text-sm transition-colors',
                        location.pathname === link.path
                          ? 'text-coope-green-600 bg-coope-green-50 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-coope-green-600'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other main links */}
          {mainLinks.slice(1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                location.pathname === link.path
                  ? activeColor
                  : `${textColor} hover:text-coope-green-500`
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: Language + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors border',
                scrolled
                  ? 'border-gray-200 text-gray-700 hover:border-coope-green-400 hover:text-coope-green-600'
                  : 'border-white/30 text-white/90 hover:border-white hover:text-white'
              )}
            >
              <Globe size={14} />
              <span className="uppercase">{lang}</span>
              <ChevronDown
                size={12}
                className={clsx('transition-transform duration-200', langOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={clsx(
                        'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                        lang === l.code
                          ? 'text-coope-green-600 bg-coope-green-50 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className={clsx(
              'relative flex items-center justify-center w-10 h-10 rounded-full transition-colors',
              scrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white/90 hover:bg-white/10'
            )}
            aria-label="Carrito"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coope-green-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-1.5">
          {/* Mobile language quick toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className={clsx(
              'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border transition-colors',
              solid ? 'border-gray-300 text-gray-700' : 'border-white/40 text-white'
            )}
          >
            <Globe size={12} />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Mobile cart */}
          <button
            onClick={toggleCart}
            className={clsx(
              'relative flex items-center justify-center w-8 h-8 rounded-full transition-colors',
              solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
            aria-label="Carrito"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coope-green-500 text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          <button
            className={clsx('p-1', solid ? 'text-gray-900' : 'text-white')}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t('a11y.menu')}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col">
              <Link to="/" className="py-3 text-gray-700 font-medium border-b border-gray-50">
                {t('nav.home')}
              </Link>

              {/* Cooperative group */}
              <div className="border-b border-gray-50">
                <p className="py-2 text-xs font-bold uppercase tracking-widest text-coope-green-600 mt-1">
                  {t('nav.cooperative')}
                </p>
                {cooperativeLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2.5 pl-3 text-gray-600 hover:text-coope-green-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {mainLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="py-3 text-gray-700 font-medium border-b border-gray-50 hover:text-coope-green-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => { closeMenu(); toggleCart(); }}
                className="mt-4 bg-coope-green-600 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-coope-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                {t('cart.title')}
                {totalItems > 0 && (
                  <span className="bg-white text-coope-green-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
