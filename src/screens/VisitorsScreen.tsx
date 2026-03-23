import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { supabase } from '../lib/supabase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setVisits, setLoading } from '../store/slices/visitSlice';
import { useLanguage } from '../contexts/LanguageContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const VisitorsScreen = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  const visits = useAppSelector(state => state.visits.list);
  const loading = useAppSelector(state => state.visits.loading);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    dispatch(setLoading(true));
    console.log('[Redux] VisitorsScreen - solicitando visitas a Supabase...');

    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert(t('error'), error.message);
    } else {
      dispatch(setVisits(data ?? []));
      console.log('[Redux] VisitorsScreen - estado actualizado, total visitas:', data?.length);
    }
    dispatch(setLoading(false));
  };

  const renderItem = ({ item }: { item: any }) => (
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
        <Text style={styles.title}>{t('visitors')}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('RegisterVisit')}>
          <Text style={styles.addBtnText}>{t('newVisitor')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>{t('noVisits')}</Text>}
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