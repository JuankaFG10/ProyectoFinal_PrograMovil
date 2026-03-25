import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { supabase } from '../lib/supabase';
import CustomButton from '../components/CustomButton';
import { useAppDispatch } from '../store/hooks';
import { updateVisitStatus } from '../store/slices/visitSlice';

interface VisitData {
  id: string;
  name: string;
  house: string;
}

const ScanQRScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed: VisitData = JSON.parse(data);

      // Verify visit exists in Supabase
      const { data: visit, error } = await supabase
        .from('visits')
        .select('*')
        .eq('id', parsed.id)
        .single();

      if (error || !visit) {
        Alert.alert('QR Inválido', 'No se encontró la visita en el sistema.', [
          { text: 'Escanear de nuevo', onPress: () => setScanned(false) }
        ]);
        return;
      }

      setVisitData(visit);
      setShowModal(true);
    } catch {
      Alert.alert('Error', 'El código QR no es válido.', [
        { text: 'Intentar de nuevo', onPress: () => setScanned(false) }
      ]);
    }
  };

 const handleApprove = async () => {
  if (!visitData) return;
  await supabase.from('visits').update({ status: 'approved' }).eq('id', visitData.id);
  // Actualiza el estado en Redux
  dispatch(updateVisitStatus({ id: visitData.id, status: 'approved' }));
  Alert.alert('✅ Acceso Aprobado', `${visitData.name} puede ingresar a casa ${visitData.house}.`);
  setShowModal(false);
  setScanned(false);
  setVisitData(null);
};

const handleDeny = async () => {
  if (!visitData) return;
  await supabase.from('visits').update({ status: 'denied' }).eq('id', visitData.id);
  // Actualiza el estado en Redux
  dispatch(updateVisitStatus({ id: visitData.id, status: 'denied' }));
  Alert.alert('❌ Acceso Denegado', `Visita de ${visitData.name} denegada.`);
  setShowModal(false);
  setScanned(false);
  setVisitData(null);
};

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permText}>Se necesita acceso a la cámara para escanear QR.</Text>
        <CustomButton title="Conceder Permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanBox} />
          <Text style={styles.hint}>Apunta al código QR del visitante</Text>
        </View>
      </CameraView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>👤 Visitante Detectado</Text>
            <Text style={styles.modalName}>{visitData?.name}</Text>
            <Text style={styles.modalMeta}>🏠 Casa {visitData?.house}</Text>
            <View style={styles.btnRow}>
              <View style={{ flex: 1 }}>
                <CustomButton title="✅ Aprobar" onPress={handleApprove} />
              </View>
              <View style={{ flex: 1 }}>
                <CustomButton title="❌ Denegar" onPress={handleDeny} variant="danger" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 220, height: 220, borderWidth: 3, borderColor: '#2563EB', borderRadius: 16, backgroundColor: 'transparent' },
  hint: { color: '#FFFFFF', marginTop: 20, fontSize: 14, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F1F5F9' },
  permText: { textAlign: 'center', color: '#475569', marginBottom: 16, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  modalName: { fontSize: 22, fontWeight: '800', color: '#2563EB' },
  modalMeta: { fontSize: 15, color: '#64748B', marginBottom: 24 },
  btnRow: { flexDirection: 'row', gap: 12 },
});

export default ScanQRScreen;
