import { useState, useMemo } from 'react';
import { Search, MapPin, Sprout, Mail, Users, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';

interface Member {
  id: number;
  name: string;
  role: string;
  province: string;
  specialty: string;
  hectares: number;
  joined: string;
  initials: string;
  color: string;
}

const members: Member[] = [
  { id: 1, name: 'Ana Sofía Quesada', role: 'Productora', province: 'Cartago', specialty: 'Cultivo orgánico CBD', hectares: 8, joined: '2021', initials: 'AQ', color: 'bg-emerald-100 text-emerald-700' },
  { id: 2, name: 'Rodrigo Mora Solís', role: 'Productor', province: 'Heredia', specialty: 'Semillas certificadas', hectares: 12, joined: '2021', initials: 'RM', color: 'bg-sky-100 text-sky-700' },
  { id: 3, name: 'María Fernanda Ureña', role: 'Productora', province: 'Alajuela', specialty: 'Fibra textil', hectares: 5, joined: '2022', initials: 'MU', color: 'bg-violet-100 text-violet-700' },
  { id: 4, name: 'Carlos Jiménez Vega', role: 'Productor', province: 'San José', specialty: 'Aceites y extractos', hectares: 3, joined: '2022', initials: 'CJ', color: 'bg-amber-100 text-amber-700' },
  { id: 5, name: 'Luisa Araya Blanco', role: 'Productora', province: 'Guanacaste', specialty: 'Agroturismo cáñamo', hectares: 20, joined: '2020', initials: 'LA', color: 'bg-rose-100 text-rose-700' },
  { id: 6, name: 'Fernando Castro Núñez', role: 'Productor', province: 'Puntarenas', specialty: 'Cosméticos naturales', hectares: 6, joined: '2022', initials: 'FC', color: 'bg-teal-100 text-teal-700' },
  { id: 7, name: 'Daniela Rojas Pérez', role: 'Productora', province: 'Limón', specialty: 'Cultivo hidropónico', hectares: 2, joined: '2023', initials: 'DR', color: 'bg-orange-100 text-orange-700' },
  { id: 8, name: 'Pablo Vargas Madrigal', role: 'Productor', province: 'Cartago', specialty: 'Nutrición animal', hectares: 15, joined: '2021', initials: 'PV', color: 'bg-indigo-100 text-indigo-700' },
  { id: 9, name: 'Silvia Chaves Mora', role: 'Productora', province: 'Heredia', specialty: 'Productos terapéuticos', hectares: 4, joined: '2022', initials: 'SC', color: 'bg-pink-100 text-pink-700' },
  { id: 10, name: 'Juan Pablo Fonseca', role: 'Productor', province: 'Alajuela', specialty: 'Biocombustibles', hectares: 18, joined: '2020', initials: 'JF', color: 'bg-green-100 text-green-700' },
  { id: 11, name: 'Andrea Bonilla Salas', role: 'Productora', province: 'San José', specialty: 'Suplementos deportivos', hectares: 7, joined: '2023', initials: 'AB', color: 'bg-cyan-100 text-cyan-700' },
  { id: 12, name: 'Diego Monge Calvo', role: 'Productor', province: 'Guanacaste', specialty: 'Cultivos orgánicos', hectares: 25, joined: '2020', initials: 'DM', color: 'bg-lime-100 text-lime-700' },
];

const stats = [
  { key: 'stat_members', value: '50+', icon: <Users size={20} /> },
  { key: 'stat_provinces', value: '7', icon: <MapPin size={20} /> },
  { key: 'stat_hectares', value: '320+', icon: <Sprout size={20} /> },
  { key: 'stat_years', value: '5', icon: <Leaf size={20} /> },
];

const provinces = ['', 'San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];

const DIRECTORY_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://coopehemp.cr/directorio#webpage',
  name: 'Directorio de Asociados — CoopeHemp R.L.',
  url: 'https://coopehemp.cr/directorio',
  description: 'Directorio oficial de los socios y productores miembros de CoopeHemp R.L. en Costa Rica. Conoce a la comunidad cooperativa.',
  isPartOf: { '@id': 'https://coopehemp.cr/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://coopehemp.cr/' },
      { '@type': 'ListItem', position: 2, name: 'Directorio', item: 'https://coopehemp.cr/directorio' },
    ],
  },
};

const Directory = () => {
  useScrollToTop();
  const { t } = useTranslation();

  useSEO({
    title: 'Directorio de Asociados',
    description: 'Conoce a los socios y productores que forman CoopeHemp R.L. en Costa Rica. Directorio oficial de la comunidad cooperativa de cáñamo sostenible.',
    path: '/directorio',
    image: '/hands-soil-group.jpg',
    structuredData: DIRECTORY_LD,
  });
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('');

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.specialty.toLowerCase().includes(search.toLowerCase());
      const matchProvince = !province || m.province === province;
      return matchSearch && matchProvince;
    });
  }, [search, province]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-coope-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hands-soil-group.jpg')] bg-cover bg-center opacity-15 mix-blend-overlay" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-coope-green-300 text-sm font-medium mb-5">
              <Users size={14} />
              CoopeHemp R.L.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('directory.title')}</h1>
            <p className="text-lg text-coope-green-100 max-w-2xl mx-auto">{t('directory.subtitle')}</p>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.key} className="text-center">
                <div className="flex justify-center mb-1 text-coope-green-300">{s.icon}</div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-coope-green-300 mt-0.5">{t(`directory.${s.key}` as Parameters<typeof t>[0])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[60px] z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('directory.search_placeholder')}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coope-green-400"
            />
          </div>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="py-2 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-coope-green-400 bg-white"
          >
            <option value="">{t('directory.filter_all')}</option>
            {provinces.slice(1).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t('directory.no_results')}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center text-lg font-bold mb-4`}>
                  {member.initials}
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-coope-green-700 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-coope-green-600 font-medium mb-3">{member.role}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={11} className="shrink-0 text-gray-400" />
                    {member.province}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Sprout size={11} className="shrink-0 text-gray-400" />
                    {member.specialty}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Leaf size={11} className="shrink-0 text-gray-400" />
                    {member.hectares} {t('directory.hectares')}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {t('directory.member_since')} {member.joined}
                  </span>
                  <a
                    href={`mailto:info@coopehemp.com?subject=Contacto: ${member.name}`}
                    className="flex items-center gap-1 text-xs text-coope-green-600 font-medium hover:text-coope-green-800 transition-colors"
                  >
                    <Mail size={11} />
                    {t('directory.contact_btn')}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-coope-green-900 text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('directory.cta_title')}</h2>
          <p className="text-coope-green-100 mb-8">{t('directory.cta_sub')}</p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-white text-coope-green-900 px-8 py-3 rounded-full font-bold hover:bg-coope-green-50 transition-colors"
          >
            {t('directory.cta_btn')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Directory;
