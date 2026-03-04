import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import CustomButton from '../components/CustomButton';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive', onPress: async () => {
          try {
            setLoading(true);
            await signOut();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Idioma</Text>
        <View style={styles.langRow}>
          {['es', 'en'].map((lang) => (
            <View key={lang} style={[styles.langBtn, locale === lang && styles.langActive]}>
              <Text
                style={[styles.langText, locale === lang && styles.langActiveText]}
                onPress={() => setLocale(lang)}
              >
                {lang === 'es' ? '🇬🇹 Español' : '🇺🇸 English'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <CustomButton title={t('logout')} onPress={handleSignOut} variant="danger" loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', padding: 24, alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 12 },
  avatarText: { fontSize: 44 },
  email: { fontSize: 16, color: '#475569', marginBottom: 36 },
  section: { width: '100%', marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase' },
  langRow: { flexDirection: 'row', gap: 10 },
  langBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  langActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  langText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  langActiveText: { color: '#2563EB', fontWeight: '700' },
});

export default ProfileScreen;
