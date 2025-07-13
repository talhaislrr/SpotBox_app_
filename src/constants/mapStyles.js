// Harita stilleri - Merkezi harita tema yönetimi

// Ultra-minimalist harita stili - Gereksiz detaylar kaldırıldı
export const minimalistMapStyle = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }] // Tüm etiketler kaldırıldı
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }] // Tüm POI'ler kaldırıldı
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f8f8f8' }] // Daha soft arkaplan
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#E3F2FD' }] // Daha soft su rengi
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }] // Yollar tamamen gizlendi
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#F5F8FF' }] // Daha açık su rengi
  }
];

// Dark tema harita stili
export const darkMapStyle = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#2C2C2C' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1A237E' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#424242' }]
  },
];

// Harita konfigürasyonları
export const mapConfigs = {
  default: {
    showsUserLocation: true,
    showsMyLocationButton: false,
    showsCompass: false,
    showsScale: false,
    showsBuildings: false,
    showsTraffic: false,
    showsIndoors: false,
    showsPointsOfInterest: false,
    toolbarEnabled: false,
  },
  minimal: {
    showsUserLocation: true,
    showsMyLocationButton: false,
    showsCompass: false,
    showsScale: false,
    showsBuildings: false,
    showsTraffic: false,
    showsIndoors: false,
    showsPointsOfInterest: false,
    toolbarEnabled: false,
    zoomEnabled: true,
    scrollEnabled: true,
    pitchEnabled: false,
    rotateEnabled: false,
  },
};

// Varsayılan bölge ayarları
export const defaultRegions = {
  istanbul: {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  ankara: {
    latitude: 39.9334,
    longitude: 32.8597,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
}; 