import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [house, setHouse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (!house) {
      Alert.alert('Error', 'El número de casa es obligatorio.');
      return;
    }
    try {
      setLoading(true);
      await signUp(email, password, 'residente', house);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Crear Cuenta</Text>

        <CustomInput
          label={t('email')}
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          label={t('password')}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomInput
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />
        <CustomInput
          label="Número de Casa *"
          placeholder="Ej: B-12"
          value={house}
          onChangeText={setHouse}
          autoCapitalize="characters"
        />

        <CustomButton title={t('register')} onPress={handleRegister} loading={loading} />
        <CustomButton
          title="¿Ya tienes cuenta? Inicia sesión"
          onPress={() => navigation.navigate('Login')}
          variant="secondary"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  heading: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: '#1E293B', marginBottom: 28 },
});

export default RegisterScreen;