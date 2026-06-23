import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Clock, Package } from 'lucide-react';

// Leaflet NO es SSR-safe (toca `window` al importarse), por eso vive en su propio
// módulo cargado solo en cliente (ver ClientOnly + lazy en index.tsx).

// Fix del ícono por defecto de Leaflet con Vite
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

const MapFly = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  if (center) map.flyTo(center, 14, { duration: 1.2 });
  return null;
};

export interface MapLocation {
  id: number;
  name: string;
  address: string;
  hours: string;
  products: string[];
  lat: number;
  lng: number;
  status: string;
}

interface LeafletMapProps {
  locations: MapLocation[];
  flyTarget: [number, number] | null;
  onSelect: (loc: MapLocation) => void;
}

export default function LeafletMap({ locations, flyTarget, onSelect }: LeafletMapProps) {
  return (
    <MapContainer center={[9.9281, -84.0907]} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFly center={flyTarget} />

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={createIcon(loc.status === 'active')}
          eventHandlers={{ click: () => onSelect(loc) }}
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
  );
}
