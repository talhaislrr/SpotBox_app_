import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../services/apiAuth';
import { useContext, useEffect, useState } from 'react';

const FeedScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (showProfile) {
      (async () => {
        const data = await getProfile();
        setProfileData(data);
      })();
    }
  }, [showProfile]);

  if (showProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowProfile(false)} style={styles.iconButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Profil</Text>
          <View style={{ width: 48 }} />
        </View>
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <Text style={styles.profileText}>Kullanıcı: {profileData?.username}</Text>
          <Text style={styles.profileText}>E-posta: {profileData?.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>        
        <TouchableOpacity onPress={() => setShowProfile(true)} style={styles.iconButton}>
          <Ionicons name="person" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Gönderiler</Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.contentText}>Burada gönderiler listelenecek.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backBlack },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surfaceGrey,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineGrey,
  },
  iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  contentText: { color: colors.textSecondary, fontSize: 16 },
  profileContainer: { padding: 16 },
  profileText: { color: colors.textPrimary, fontSize: 18, marginVertical: 8 },
  logoutButton: { marginTop: 24, padding: 12, backgroundColor: colors.error, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
}); 