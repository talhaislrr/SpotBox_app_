import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../services/apiAuth';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Profil verisi alınamadı:', error);
        Alert.alert('Hata', error.message);
      }
    };
    if (user) loadProfile();
  }, [user]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>  
      <View style={styles.header}>  
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/profile_avatar.png')} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{profileData?.username || user?.email || 'Kullanıcı Adı'}</Text>
        <Text style={styles.email}>{profileData?.email || user?.email || ''}</Text>
        <View style={styles.optionList}>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('ProfileEdit')}>
            <Text style={styles.optionText}>Profil Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Ayarlar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={logout}>
            <Text style={[styles.optionText, { color: colors.error }]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceGrey,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineGrey,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.surfaceGrey,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  optionList: {
    width: '100%',
  },
  optionItem: {
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
}); 