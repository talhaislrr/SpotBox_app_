import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Dimensions, 
  StyleSheet,
  Platform,
  BackHandler,
  LogBox,
  Text
} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import FeedScreen from '../screens/FeedScreen';
import { colors } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

// Loglama için global değişken (loglar kapalı)
const swipeDebug = false; // true yaparak debug loglarını tekrar açabilirsiniz
const logSwipe = () => {}; // no-op, logları tamamen devre dışı bırakır

// FlatList uyarılarını engelle
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const SwipeableScreenContainer = ({ navigation, route }) => {
  // Mevcut ekran durumu
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isScrolling, setIsScrolling] = useState(false);
  const initialScrollDone = useRef(false);
  
  // Düzeltme döngüsünü önlemek için ref
  const isAdjusting = useRef(false);
  
  // Kaydırma harici durum değişimi kontrolü
  const preventStateUpdate = useRef(false);
  
  // Son geçerli ekran, navigasyon sırasında tutarsızlıkları önlemek için
  const lastValidScreen = useRef('Home');
  
  // Aktif ekran indeksi referansı
  const activeScreenIndexRef = useRef(1);
  
  // FlatList referansı
  const flatListRef = useRef(null);
  
  // Ekranlarımızın verileri - Library ve Chat'in yeri değişti
  const screens = [
    { key: 'Library', component: <FeedScreen navigation={navigation} />, index: 0 },
    { key: 'Home', component: <HomeScreen navigation={navigation} />, index: 1 },
    { key: 'Chat', component: <ChatScreen />, index: 2 },
  ];
  
  // Ekran indeks haritası - Library ve Chat'in indexleri güncellendi
  const screenIndexMap = {
    Library: 0,
    Home: 1,
    Chat: 2
  };
  
  // İlk param kurulumu
  useEffect(() => {
    // Sadece ilk yüklemede çalışacak
    if (!initialScrollDone.current) {
      logSwipe(`İlk yükleme: Home ekranına ayarlanıyor`);
      navigation.setParams({ currentScreen: 'Home' });
      lastValidScreen.current = 'Home';
      initialScrollDone.current = true;
      
      // İlk yükleme sırasında FlatList'in Home ekranına odaklanmasını sağla
      setTimeout(() => {
        logSwipe(`İlk pozisyon: Home (index: 1)`);
        flatListRef.current?.scrollToIndex({
          index: 1,
          animated: false
        });
        activeScreenIndexRef.current = 1;
      }, 100);
    }
  }, [navigation]);

  // Back button handler for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (currentScreen !== 'Home') {
          navigateToScreen('Home');
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [currentScreen]);

  // Navigation parametrelerini dinle
  useEffect(() => {
    // navigateTo parametresi varsa ve mevcut ekrandan farklıysa ve kaydırma işlemi yoksa navigasyon yap
    if (route?.params?.navigateTo && route.params.navigateTo !== currentScreen && !isScrolling && !isAdjusting.current) {
      logSwipe(`Buton navigasyonu: ${currentScreen} -> ${route.params.navigateTo}`);
      navigateToScreen(route.params.navigateTo);
    }
  }, [route?.params?.navigateTo, currentScreen, isScrolling]);

  // Ekrana geçiş fonksiyonu
  const navigateToScreen = useCallback((screenName) => {
    if (currentScreen === screenName || isScrolling || isAdjusting.current) {
      logSwipe(`Navigasyon iptal: ${screenName} (zaten ${currentScreen} ekranındayız veya kaydırma yapılıyor)`);
      return;
    }
    
    const index = screenIndexMap[screenName];
    
    if (index !== undefined) {
      setIsScrolling(true);
      isAdjusting.current = true;
      preventStateUpdate.current = true;
      
      logSwipe(`Navigasyon başladı: ${currentScreen} -> ${screenName} (index: ${index})`);
      
      // Önce durumu güncelle ki FlatList durumunu kontrol ederken tutarlı olsun
      setCurrentScreen(screenName);
      // currentScreen parametresini güncelle ve navigateTo'yu temizle
      navigation.setParams({ currentScreen: screenName, navigateTo: null });
      lastValidScreen.current = screenName;
      activeScreenIndexRef.current = index;
      
      // Sonra FlatList'i kaydır
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true
        });
        
        // Animasyon bittikten sonra kaydırma durumunu kapat
        setTimeout(() => {
          setIsScrolling(false);
          isAdjusting.current = false;
          preventStateUpdate.current = false;
          logSwipe(`Navigasyon tamamlandı: ${screenName}`);
        }, 400);
      }, 50);
    }
  }, [currentScreen, isScrolling, navigation]);

  // Kaydırma başladığında
  const handleScrollBeginDrag = useCallback((e) => {
    if (isAdjusting.current) {
      logSwipe(`Kaydırma iptal: düzeltme işlemi devam ediyor`);
      return;
    }
    
    preventStateUpdate.current = false;
    const xOffset = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(xOffset / screenWidth);
    logSwipe(`Kaydırma başladı - xOffset: ${xOffset}, başlangıç indeksi: ${currentIndex}`);
    setIsScrolling(true);
  }, []);

  // Her bir ekranı render etme fonksiyonu
  const renderItem = useCallback(({ item }) => {
    return (
      <View style={[styles.screen, { width: screenWidth }]}>
        {item.component}
        {swipeDebug && (
          <View style={styles.debugOverlay}>
            <Text style={styles.debugText}>{`Screen: ${item.key}`}</Text>
          </View>
        )}
      </View>
    );
  }, []);

  // Kaydırma sonrasında ekran değişimini tamamlayan fonksiyon
  const handleMomentumScrollEnd = useCallback((event) => {
    // Eğer düzeltme işlemi devam ediyorsa, işlemi iptal et
    if (isAdjusting.current || preventStateUpdate.current) {
      logSwipe(`MomentumScrollEnd iptal: düzeltme işlemi devam ediyor veya durum güncellemesi engellendi`);
      return;
    }
    
    // Offset hesapla
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    
    // Eğer index geçerli aralıkta değilse düzeltme yap
    const safeIndex = Math.max(0, Math.min(index, screens.length - 1));
    const screenKey = screens[safeIndex].key;
    
    logSwipe(`Kaydırma bitti - contentOffset: ${contentOffset}, index: ${index}, safeIndex: ${safeIndex}, screenKey: ${screenKey}`);
    
    // Önemli: Eğer contentOffset tam bir ekran genişliğinin çok uzağında değilse, ekranı değiştir
    const offsetDiff = Math.abs(contentOffset - (safeIndex * screenWidth));
    const isSignificantDifference = offsetDiff > 30;
    
    logSwipe(`Offset farkı: ${offsetDiff}, Önemli fark mı: ${isSignificantDifference}`);
    
    // Eğer önemli bir fark varsa düzeltme yap
    if (isSignificantDifference && !isAdjusting.current) {
      logSwipe(`Önemli yanlış hizalama tespit edildi - düzeltiliyor: ${safeIndex}`);
      
      isAdjusting.current = true;
      
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: safeIndex,
          animated: true,
          viewOffset: 0
        });
        
        // Düzeltme tamamlandı bayrağını temizle
        setTimeout(() => {
          isAdjusting.current = false;
          logSwipe(`Düzeltme tamamlandı`);
        }, 300);
      }, 100);
    } else {
      logSwipe(`Düzeltmeye gerek yok, pozisyon kabul edilebilir`);
    }
    
    // Ekran değişimi - bu kritik nokta
    if (screenKey !== currentScreen) {
      logSwipe(`Ekran değişimi: ${currentScreen} -> ${screenKey}`);
      setCurrentScreen(screenKey);
      // currentScreen parametresini güncelle ve navigateTo'yu temizle
      navigation.setParams({ currentScreen: screenKey, navigateTo: null });
      lastValidScreen.current = screenKey;
      activeScreenIndexRef.current = safeIndex;
    }
    
    // İşlem tamamlandı, kaydırma durumunu kapat
    setTimeout(() => {
      setIsScrolling(false);
      logSwipe(`Kaydırma durumu kapatıldı: ${screenKey}`);
    }, 300);
  }, [navigation, screens, currentScreen]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={screens}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        initialScrollIndex={1}
        directionalLockEnabled={true}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="center"
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        removeClippedSubviews={false}
        keyExtractor={(item) => item.key}
      />
      
      {swipeDebug && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugInfoText}>
            {`Current: ${currentScreen} | isScrolling: ${isScrolling ? 'true' : 'false'} | isAdjusting: ${isAdjusting.current ? 'true' : 'false'}`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screen: {
    flex: 1,
  },
  debugOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
  debugInfo: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    alignItems: 'center',
  },
  debugInfoText: {
    color: 'white',
    fontSize: 12,
  }
});

export default SwipeableScreenContainer; 