import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { BoxesContext } from '../context/BoxesContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MapScreen = () => {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [location, setLocation] = useState(null);
  const { boxes } = useContext(BoxesContext);
  const [selectedBox, setSelectedBox] = useState(null);
  const handleBoxPress = (box) => setSelectedBox(box);

  // Konum izni ve mevcut konumu al
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    Alert.alert(
      'Konum Seçildi',
      `${location.name} lokasyonu seçildi. Burada spot paylaşabilirsiniz!`,
      [
        { text: 'Tamam', style: 'default' },
        { text: 'Spot Paylaş', style: 'default', onPress: () => handleShareSpot(location) }
      ]
    );
  };

  const handleShareSpot = (location) => {
    Alert.alert(
      'Spot Paylaşılıyor',
      `${location.name} lokasyonunda yeni spot paylaşılacak!`,
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  // Örnek lokasyonlar
  const sampleLocations = [
    { id: 1, name: 'Taksim Meydanı', lat: 41.0369, lng: 28.9859, type: 'popular' },
    { id: 2, name: 'Galata Kulesi', lat: 41.0256, lng: 28.9744, type: 'landmark' },
    { id: 3, name: 'Karaköy', lat: 41.0267, lng: 28.9779, type: 'neighborhood' },
    { id: 4, name: 'Cihangir', lat: 41.0316, lng: 28.9794, type: 'neighborhood' },
    { id: 5, name: 'Bebek Parkı', lat: 41.0776, lng: 29.0427, type: 'park' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Harita</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Container */}
      <View style={{ flex: 1 }}>
        <MapView
           provider={Platform.OS === 'android' ? 'google' : undefined}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            customMapStyle={[]}
            userInterfaceStyle="dark"
          >
            {/* Kullanıcı konumu marker'ı */}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Konumum"
                description="Şu anda buradayım"
              />
            )}
            {/* Örnek lokasyonlar */}
            {sampleLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{ latitude: location.lat, longitude: location.lng }}
                title={location.name}
                description={location.type}
                onPress={() => handleLocationSelect(location)}
              />
            ))}
            {boxes.map((box) => (
              <Marker
                key={box.id}
                coordinate={{ latitude: box.location.latitude, longitude: box.location.longitude }}
                onPress={() => handleBoxPress(box)}
              >
                <Callout onPress={() => handleBoxPress(box)} tooltip>
                  <View style={styles.calloutContent}>
                    <Text style={styles.calloutText}>Fotoğrafları Göster</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="layers" size={24} color="#2C3E50" />
          <Text style={styles.controlText}>Katmanlar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="location" size={24} color="#2C3E50" />
          <Text style={styles.controlText}>Konumum</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="add-circle" size={24} color="#E74C3C" />
          <Text style={styles.controlText}>Spot Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Location Info */}
      {selectedLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{selectedLocation.name}</Text>
          <Text style={styles.locationType}>{selectedLocation.type}</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => handleShareSpot(selectedLocation)}
          >
            <Text style={styles.shareButtonText}>Spot Paylaş</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Box Photos Modal */}
      {selectedBox && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedBox(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedBox(null)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.photoContainer}>
                {selectedBox.photos.map((photo, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: photo.uri || photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2C3E50',
    borderBottomWidth: 1,
    borderBottomColor: '#34495E',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 5,
    marginLeft: 10,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BDC3C7',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 20,
  },
  mapSubText: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  locationPin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#BDC3C7',
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlText: {
    fontSize: 12,
    color: '#2C3E50',
    marginTop: 5,
    fontWeight: '500',
  },
  locationInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  locationType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  shareButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.9,
    backgroundColor: '#0E0E0F',
    borderRadius: 8,
    padding: 16,
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photo: {
    width: screenWidth * 0.42,
    height: screenWidth * 0.42,
    borderRadius: 8,
  },
  // Callout style
  calloutContent: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  calloutText: {
    color: '#000',
    fontSize: 14,
  },
});

export default MapScreen; 