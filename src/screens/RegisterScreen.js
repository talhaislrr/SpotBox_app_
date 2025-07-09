import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
// Firebase Firestore bağlantısını kaldırdım; artık backend API kullanılıyor

const RegisterScreen = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    // Zorunlu alan doğrulama
    if (!username.trim()) {
      Alert.alert('Kayıt Hatası', 'Kullanıcı adı alanı boş olamaz');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Kayıt Hatası', 'E-posta alanı boş olamaz');
      return;
    }
    if (!password) {
      Alert.alert('Kayıt Hatası', 'Şifre alanı boş olamaz');
      return;
    }
    console.log('Kayıt bilgileri:', { email, username, password });
    try {
      const user = await signUp(email, password, username);
      // Kayıt başarılı, geri dön
      navigation.goBack();
    } catch (error) {
      Alert.alert('Kayıt Hatası', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        placeholderTextColor="#B5B7BB"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#B5B7BB"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#B5B7BB"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#0E0E0F' },
  title: { fontSize: 24, fontWeight: '600', color: '#F5F6F8', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: '#1C1C1F', color: '#F5F6F8', padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#1BC9F5', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#0E0E0F', fontWeight: '600' },
  link: { color: '#1BC9F5', textAlign: 'center', marginTop: 8 },
}); 