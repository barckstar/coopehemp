import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { subscribeNewsletter } from '../api/newsletter';

const Footer = () => {
  const { t, lang } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email, lang);
      setStatus('ok');
      setMessage(res.message);
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Error al suscribirse.');
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white">
              <span className="text-xl font-bold">CoopeHemp</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-coope-green-400 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-coope-green-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-coope-green-400 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t('footer.links_title')}
            </h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm hover:text-coope-green-400 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/directorio" className="text-sm hover:text-coope-green-400 transition-colors">{t('nav.directory')}</Link></li>
              <li><Link to="/transparencia" className="text-sm hover:text-coope-green-400 transition-colors">{t('nav.transparency')}</Link></li>
              <li><Link to="/productos" className="text-sm hover:text-coope-green-400 transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/mapa" className="text-sm hover:text-coope-green-400 transition-colors">{t('nav.map')}</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-coope-green-400 transition-colors">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t('footer.contact_title')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-coope-green-500 mt-0.5 shrink-0" />
                <span className="text-sm">{t('footer.location')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-coope-green-500 shrink-0" />
                <a href="mailto:info@coopehemp.com" className="text-sm hover:text-coope-green-400 transition-colors">
                  info@coopehemp.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-coope-green-500 shrink-0" />
                <a href="tel:+50600000000" className="text-sm hover:text-coope-green-400 transition-colors">
                  +506 0000-0000
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t('footer.newsletter_title')}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{t('footer.newsletter_desc')}</p>

            {status === 'ok' ? (
              <div className="flex items-center gap-2 text-coope-green-400 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter_placeholder')}
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-coope-green-500 focus:border-transparent outline-none text-sm transition-all disabled:opacity-50"
                />
                {status === 'error' && (
                  <p className="text-red-400 text-xs">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-coope-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-coope-green-500 transition-colors text-sm font-medium disabled:opacity-60"
                >
                  {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {t('footer.newsletter_btn')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} CoopeHemp R.L. — {t('footer.rights')}
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <Link to="/transparencia" className="hover:text-gray-400 transition-colors">
              {t('nav.transparency')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
