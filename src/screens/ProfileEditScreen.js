import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { updateMyProfile } from '../services/apiUsers';

const ProfileEditScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, updateUserProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const updatedData = { name, email, username };
      const updatedUser = await updateMyProfile(updatedData);
      updateUserProfile(updatedUser); // Context'i ve AsyncStorage'ı güncelle
      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>  
      <View style={styles.header}>  
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profili Düzenle</Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Kullanıcı adı düzenleme */}
        <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {/* Ad değişikliği */}
        <Text style={styles.inputLabel}>Adı Değiştir</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        {/* E-posta düzenleme */}
        <Text style={styles.inputLabel}>E-posta Adresi</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backBlack },
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
  closeButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  contentContainer: { padding: 16 },
  input: {
    backgroundColor: colors.surfaceGrey,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
}); 