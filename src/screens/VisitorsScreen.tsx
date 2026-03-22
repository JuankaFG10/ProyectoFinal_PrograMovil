import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { supabase, MOCK_MODE, mockSupabase } from '../lib/supabase';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Visitor {
  id: string;
  name: string;
  id_number: string;
  house: string;
  created_at: string;
}

const VisitorsScreen = () => {
  const navigation = useNavigation<Nav>();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    if (MOCK_MODE) {
      setVisitors([
        { id: '1', name: 'Ana García', id_number: '2134 56789 0101', house: 'A-1', created_at: new Date().toISOString() },
        { id: '2', name: 'Luis Pérez', id_number: '3001 12345 6789', house: 'B-12', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', name: 'María López', id_number: '1590 00011 2233', house: 'C-5', created_at: new Date(Date.now() - 7200000).toISOString() },
      ]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) Alert.alert('Error', error.message);
    else setVisitors(data ?? []);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: Visitor }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VisitDetail', { visitId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>🪪 {item.id_number}</Text>
        <Text style={styles.meta}>🏠 Casa {item.house}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visitantes</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('RegisterVisit')}>
          <Text style={styles.addBtnText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={visitors}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay visitas registradas aún.</Text>}
          onRefresh={fetchVisitors}
          refreshing={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  addBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardLeft: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  meta: { fontSize: 13, color: '#64748B', marginTop: 2 },
  arrow: { fontSize: 22, color: '#94A3B8' },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 60, fontSize: 15 },
});

export default VisitorsScreen;
