import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Clock, Package, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';

// Fix Leaflet default icon issue with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIcon = (active: boolean) =>
  L.divIcon({
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:${active ? '#2f884a' : '#9ca3af'};
      border:2px solid white;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });

interface VendingLocation {
  id: number;
  name: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  status: 'active' | 'soon';
  hours: string;
  products: string[];
}

const locations: VendingLocation[] = [
  {
    id: 1,
    name: 'CoopeHemp — Mall San Pedro',
    province: 'San José',
    address: 'Mall San Pedro, San José',
    lat: 9.9350,
    lng: -84.0500,
    status: 'active',
    hours: 'Lun–Dom 8:00–21:00',
    products: ['Aceite CBD', 'Té de Cáñamo', 'Crema CBD'],
  },
  {
    id: 2,
    name: 'CoopeHemp — Escazú Village',
    province: 'San José',
    address: 'Escazú Village, Escazú',
    lat: 9.9175,
    lng: -84.1400,
    status: 'active',
    hours: 'Lun–Dom 9:00–22:00',
    products: ['Aceite CBD', 'Gummies', 'Pre-rolls'],
  },
  {
    id: 3,
    name: 'CoopeHemp — Multiplaza Alajuela',
    province: 'Alajuela',
    address: 'Multiplaza, Alajuela',
    lat: 10.0162,
    lng: -84.2146,
    status: 'active',
    hours: 'Lun–Dom 10:00–21:00',
    products: ['Aceite CBD', 'Té de Cáñamo'],
  },
  {
    id: 4,
    name: 'CoopeHemp — Cartago Centro',
    province: 'Cartago',
    address: 'Av. Central, Cartago',
    lat: 9.8646,
    lng: -83.9197,
    status: 'active',
    hours: 'Lun–Sáb 9:00–20:00',
    products: ['Crema CBD', 'Bálsamo', 'Aceite CBD'],
  },
  {
    id: 5,
    name: 'CoopeHemp — Heredia Centro',
    province: 'Heredia',
    address: 'Parque Central, Heredia',
    lat: 10.0049,
    lng: -84.1156,
    status: 'active',
    hours: 'Lun–Sáb 8:30–19:30',
    products: ['Té de Cáñamo', 'Gummies'],
  },
  {
    id: 6,
    name: 'CoopeHemp — Liberia',
    province: 'Guanacaste',
    address: 'Centro Comercial, Liberia',
    lat: 10.6350,
    lng: -85.4406,
    status: 'soon',
    hours: 'Próximamente',
    products: ['Aceite CBD', 'Té de Cáñamo'],
  },
  {
    id: 7,
    name: 'CoopeHemp — Puntarenas Puerto',
    province: 'Puntarenas',
    address: 'Puerto Puntarenas, Puntarenas',
    lat: 9.9740,
    lng: -84.8367,
    status: 'soon',
    hours: 'Próximamente',
    products: ['Aceite CBD', 'Crema CBD'],
  },
  {
    id: 8,
    name: 'CoopeHemp — Limón Centro',
    province: 'Limón',
    address: 'Av. 2, Puerto Limón',
    lat: 10.0014,
    lng: -83.0763,
    status: 'soon',
    hours: 'Próximamente',
    products: ['Aceite CBD', 'Gummies'],
  },
  {
    id: 9,
    name: 'CoopeHemp — Quepos',
    province: 'Puntarenas',
    address: 'Centro, Quepos',
    lat: 9.4321,
    lng: -84.1634,
    status: 'soon',
    hours: 'Próximamente',
    products: ['Aceite CBD', 'Té de Cáñamo'],
  },
];

const provinces = ['Todas las provincias', ...Array.from(new Set(locations.map((l) => l.province)))];

// Component that flies to a selected location
const MapFly = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  if (center) map.flyTo(center, 14, { duration: 1.2 });
  return null;
};

const MAP_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://coopehemp.cr/mapa#webpage',
  name: 'Puntos de Venta — CoopeHemp R.L.',
  url: 'https://coopehemp.cr/mapa',
  description: 'Encuentra los puntos de venta y distribuidores oficiales de productos CoopeHemp en Costa Rica. Mapa interactivo con ubicaciones y horarios.',
  isPartOf: { '@id': 'https://coopehemp.cr/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://coopehemp.cr/' },
      { '@type': 'ListItem', position: 2, name: 'Puntos de Venta', item: 'https://coopehemp.cr/mapa' },
    ],
  },
};

const VendingMap = () => {
  useScrollToTop();
  const { t } = useTranslation();

  useSEO({
    title: 'Puntos de Venta — Encuentra Nuestros Productos',
    description: 'Localiza los puntos de venta y distribuidores de productos CoopeHemp en Costa Rica. Mapa interactivo con tiendas, horarios y productos disponibles.',
    path: '/mapa',
    image: '/hemp-field-sunrise.jpg',
    structuredData: MAP_LD,
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'soon'>('all');
  const [province, setProvince] = useState('Todas las provincias');
  const [selected, setSelected] = useState<VendingLocation | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.province.toLowerCase().includes(search.toLowerCase()) ||
        l.address.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || l.status === filter;
      const matchProvince = province === 'Todas las provincias' || l.province === province;
      return matchSearch && matchFilter && matchProvince;
    });
  }, [search, filter, province]);

  const handleSelect = (loc: VendingLocation) => {
    setSelected(loc);
    setFlyTarget([loc.lat, loc.lng]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-coope-green-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hemp-field.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-coope-green-300 text-sm font-medium mb-5">
              <MapPin size={14} />
              Costa Rica
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('map.title')}</h1>
            <p className="text-lg text-coope-green-100 max-w-2xl mx-auto">
              {t('map.subtitle')}
            </p>
            <p className="mt-3 text-coope-green-300 text-sm font-medium">
              {t('map.total_locations', { count: String(locations.length) })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('map.search_placeholder')}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coope-green-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {(['all', 'active', 'soon'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f
                      ? 'bg-coope-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t(`map.filter_${f}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="py-2 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-coope-green-400 bg-white"
          >
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6" style={{ height: '600px' }}>
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0 overflow-y-auto rounded-2xl border border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">
                {t('map.locations_title')} ({filtered.length})
              </p>
            </div>

            {filtered.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">{t('map.no_results')}</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {filtered.map((loc) => (
                  <li key={loc.id}>
                    <button
                      onClick={() => handleSelect(loc)}
                      className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                        selected?.id === loc.id ? 'bg-coope-green-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                            loc.status === 'active' ? 'bg-coope-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{loc.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
                          <span
                            className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                              loc.status === 'active'
                                ? 'bg-coope-green-100 text-coope-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {t(loc.status === 'active' ? 'map.status_active' : 'map.status_soon')}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Map */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm min-h-[400px]">
            <MapContainer
              center={[9.9281, -84.0907]}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapFly center={flyTarget} />

              {filtered.map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.lat, loc.lng]}
                  icon={createIcon(loc.status === 'active')}
                  eventHandlers={{ click: () => setSelected(loc) }}
                >
                  <Popup>
                    <div className="min-w-[200px] py-1">
                      <p className="font-bold text-gray-900 text-sm mb-1">{loc.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                        <MapPin size={11} />
                        {loc.address}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                        <Clock size={11} />
                        {loc.hours}
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <Package size={11} className="mt-0.5 shrink-0" />
                        <span>{loc.products.join(', ')}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Selected detail card */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-2xl border border-coope-green-200 p-6 flex flex-wrap gap-6 items-start"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    selected.status === 'active' ? 'bg-coope-green-500' : 'bg-gray-400'
                  }`}
                />
                <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{selected.address}</p>
            </div>
            <div className="flex gap-6 text-sm flex-wrap">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{t('map.popup_hours')}</p>
                <p className="text-gray-700">{selected.hours}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{t('map.popup_products')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.products.map((p) => (
                    <span key={p} className="text-xs bg-coope-green-50 text-coope-green-700 px-2 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VendingMap;
