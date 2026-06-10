import { FileText, Download, ExternalLink, ShieldCheck, Users, Sprout, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';

interface DocItem {
  name: string;
  date: string;
  type: 'PDF' | 'XLSX';
  size: string;
}

interface DocCategory {
  title: string;
  icon: React.ReactNode;
  docs: DocItem[];
}

const docCategories: DocCategory[] = [
  {
    title: 'Estatutos y Actas',
    icon: <FileText size={18} />,
    docs: [
      { name: 'Acta Constitutiva CoopeHemp R.L.', date: 'Ene 2021', type: 'PDF', size: '1.2 MB' },
      { name: 'Estatutos Vigentes 2024', date: 'Mar 2024', type: 'PDF', size: '840 KB' },
      { name: 'Reglamento Interno', date: 'Ago 2023', type: 'PDF', size: '620 KB' },
    ],
  },
  {
    title: 'Informes Anuales',
    icon: <ExternalLink size={18} />,
    docs: [
      { name: 'Informe Anual 2024', date: 'Dic 2024', type: 'PDF', size: '4.1 MB' },
      { name: 'Informe Anual 2023', date: 'Dic 2023', type: 'PDF', size: '3.8 MB' },
      { name: 'Informe Anual 2022', date: 'Dic 2022', type: 'PDF', size: '2.9 MB' },
    ],
  },
  {
    title: 'Informes Financieros',
    icon: <ExternalLink size={18} />,
    docs: [
      { name: 'Estados Financieros 2024', date: 'Feb 2025', type: 'PDF', size: '890 KB' },
      { name: 'Presupuesto Operativo 2025', date: 'Ene 2025', type: 'XLSX', size: '245 KB' },
      { name: 'Auditoría Externa 2023', date: 'Mar 2024', type: 'PDF', size: '1.5 MB' },
    ],
  },
  {
    title: 'Normativas y Permisos',
    icon: <ShieldCheck size={18} />,
    docs: [
      { name: 'Licencia CONARROZ Cáñamo Industrial', date: 'Jun 2024', type: 'PDF', size: '310 KB' },
      { name: 'Permiso SENASA Producción', date: 'Abr 2024', type: 'PDF', size: '280 KB' },
      { name: 'Certificado BPA – Buenas Prácticas Agrícolas', date: 'Nov 2023', type: 'PDF', size: '420 KB' },
    ],
  },
];

const certs = [
  {
    icon: <Sprout size={28} className="text-coope-green-600" />,
    titleKey: 'transparency.cert_organic',
    descKey: 'transparency.cert_organic_desc',
    badge: 'SENASA',
  },
  {
    icon: <ShieldCheck size={28} className="text-blue-600" />,
    titleKey: 'transparency.cert_quality',
    descKey: 'transparency.cert_quality_desc',
    badge: 'ISO',
  },
  {
    icon: <FileText size={28} className="text-coope-earth-600" />,
    titleKey: 'transparency.cert_hemp',
    descKey: 'transparency.cert_hemp_desc',
    badge: 'MAG',
  },
];

const statsData = [
  { key: 'transparency.stat_members', value: '50+', icon: <Users size={22} /> },
  { key: 'transparency.stat_provinces', value: '7', icon: <Sprout size={22} /> },
  { key: 'transparency.stat_hectares', value: '320+', icon: <Sprout size={22} /> },
  { key: 'transparency.stat_products', value: '15+', icon: <Package size={22} /> },
];

const Transparency = () => {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-coope-green-950 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-white/20 rounded-full"
              style={{
                width: `${(i + 1) * 180}px`,
                height: `${(i + 1) * 180}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-coope-green-300 text-sm font-medium mb-5">
              <ShieldCheck size={14} />
              CoopeHemp R.L.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('transparency.title')}</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('transparency.subtitle')}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {/* Certifications */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('transparency.certifications_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {certs.map((c) => (
              <div
                key={c.titleKey}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 items-start"
              >
                <div className="p-3 rounded-xl bg-gray-50 shrink-0">{c.icon}</div>
                <div>
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{c.badge}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">
                    {t(c.titleKey as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {t(c.descKey as Parameters<typeof t>[0])}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Documents */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {docCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                  <span className="text-coope-green-600">{cat.icon}</span>
                  <h3 className="font-semibold text-gray-800 text-sm">{cat.title}</h3>
                </div>
                <ul className="divide-y divide-gray-50">
                  {cat.docs.map((doc) => (
                    <li
                      key={doc.name}
                      className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t('transparency.updated')}: {doc.date} · {doc.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            doc.type === 'PDF'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {doc.type}
                        </span>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-coope-green-600 hover:bg-coope-green-50 transition-colors"
                          title={t('transparency.download')}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 bg-coope-green-900 rounded-3xl p-8 text-white"
        >
          <h2 className="text-xl font-bold mb-8 text-coope-green-100">{t('transparency.stats_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((s) => (
              <div key={s.key} className="text-center">
                <div className="flex justify-center mb-2 text-coope-green-300">{s.icon}</div>
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-coope-green-300 mt-1">
                  {t(s.key as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('transparency.cta_title')}</h2>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">{t('transparency.cta_sub')}</p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-coope-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-coope-green-700 transition-colors"
          >
            {t('transparency.cta_btn')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Transparency;
