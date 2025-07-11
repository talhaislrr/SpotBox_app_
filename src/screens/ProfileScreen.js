import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appbar, Avatar, Card, Button, Divider, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../services/apiAuth';
import { colors } from '../constants/colors';
import { API_URL } from '../services/config';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backBlack, paddingTop: insets.top }}>
      <Appbar.Header style={{ backgroundColor: colors.surfaceGrey }}>
        <Appbar.BackAction color={colors.primary} onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={profile?.username || ''}
          subtitle={profile?.email || ''}
          titleStyle={{ color: colors.textPrimary }}
          subtitleStyle={{ color: colors.textSecondary }}
        />
        <Appbar.Action icon='logout' color={colors.primary} onPress={logout} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Avatar.Image size={100} source={require('../../assets/profile_avatar.png')} />
          <Text variant='headlineMedium' style={{ marginTop: 12, color: colors.textPrimary }}>
            {profile?.username}
          </Text>
          <Text variant='bodyMedium' style={{ color: colors.textSecondary }}>
            {profile?.email}
          </Text>
        </View>

        <Divider style={{ marginVertical: 16, backgroundColor: colors.outlineGrey }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text variant='labelLarge' style={{ color: colors.textSecondary }}>Fotoğraflar</Text>
            <Text variant='headlineSmall' style={{ color: colors.textPrimary }}>
              {profile?.photos?.length || 0}
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text variant='labelLarge' style={{ color: colors.textSecondary }}>Takipçi</Text>
            <Text variant='headlineSmall' style={{ color: colors.textPrimary }}>
              {profile?.followers?.length || 0}
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text variant='labelLarge' style={{ color: colors.textSecondary }}>Takip</Text>
            <Text variant='headlineSmall' style={{ color: colors.textPrimary }}>
              {profile?.following?.length || 0}
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text variant='labelLarge' style={{ color: colors.textSecondary }}>Arkadaşlar</Text>
            <Text variant='headlineSmall' style={{ color: colors.textPrimary }}>
              {profile?.friends?.length || 0}
            </Text>
          </View>
        </View>

        <Divider style={{ marginVertical: 16, backgroundColor: colors.outlineGrey }} />

        <Text variant='titleMedium' style={{ marginBottom: 12, color: colors.textPrimary }}>
          Galeri
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {profile?.photos?.map((filename, index) => (
            <TouchableOpacity key={index} style={{ width: '48%', aspectRatio: 1, marginBottom: 8 }}>
              <Card style={{ flex: 1, backgroundColor: colors.surfaceGrey }}>
                <Card.Cover source={{ uri: `${API_URL}/uploads/${filename}` }} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Button mode='contained' buttonColor={colors.primary} textColor={colors.backBlack} style={{ marginTop: 24 }} onPress={logout}>
          Çıkış Yap
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 