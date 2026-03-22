import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { supabase, MOCK_MODE, mockSupabase } from '../lib/supabase';

interface Visit {
  id: string;
  name: string;
  house: string;
  created_at: string;
  status: string;
}

const HistoryScreen = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    if (MOCK_MODE) {
      setVisits([
        { id: '1', name: 'Ana García', house: 'A-1', status: 'approved', created_at: new Date().toISOString() },
        { id: '2', name: 'Luis Pérez', house: 'B-12', status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', name: 'María López', house: 'C-5', status: 'denied', created_at: new Date(Date.now() - 7200000).toISOString() },
      ]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error) setVisits(data ?? []);
    setLoading(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: Visit }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>🏠 Casa {item.house}</Text>
        <Text style={styles.date}>🕐 {formatDate(item.created_at)}</Text>
      </View>
      <View style={[styles.badge, item.status === 'approved' ? styles.approved : styles.pending]}>
        <Text style={styles.badgeText}>{item.status === 'approved' ? '✓ Aprobado' : '⏳ Pendiente'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Visitas</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Sin historial disponible.</Text>}
          onRefresh={fetchHistory}
          refreshing={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B', padding: 24, paddingBottom: 12 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardLeft: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  meta: { fontSize: 13, color: '#64748B', marginTop: 2 },
  date: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  approved: { backgroundColor: '#DCFCE7' },
  pending: { backgroundColor: '#FEF9C3' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#334155' },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 60, fontSize: 15 },
});

export default HistoryScreen;
