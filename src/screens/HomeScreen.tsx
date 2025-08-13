import React, { useState } from 'react';
import { Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Home, Room } from '../types';
import { useHomes } from '../hooks/useFirestore';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { homes, addHome, loading } = useHomes();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [homeName, setHomeName] = useState('');
  const [homeAddress, setHomeAddress] = useState('');

  const handleAddHome = () => {
    setModalVisible(true);
  };

  const handleModalAdd = () => {
    if (homeName.trim() && homeAddress.trim()) {
      addHome(homeName.trim(), homeAddress.trim());
      setHomeName('');
      setHomeAddress('');
      setModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setHomeName('');
    setHomeAddress('');
    setModalVisible(false);
  };

  const renderHomeCard = ({ item }: { item: Home }) => (
    <TouchableOpacity
      style={[styles.homeCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('Rooms', { home: item })}
    >
      <View style={styles.homeHeader}>
        <Text style={[styles.homeName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.homeAddress, { color: theme.colors.textSecondary }]}>{item.address}</Text>
      </View>
      
      <View style={styles.homeStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{item.rooms.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rooms</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
            {item.rooms.reduce((total, room) => total + room.devices.length, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Devices</Text>
        </View>
      </View>

      <View style={styles.roomPreview}>
        <Text style={[styles.roomPreviewTitle, { color: theme.colors.textSecondary }]}>Rooms:</Text>
        <Text style={[styles.roomPreviewText, { color: theme.colors.text }]}>
          {item.rooms.map(room => room.name).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Homes</Text>
      </View>

      <FlatList
        data={homes}
        renderItem={renderHomeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={() => {}}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleModalCancel}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <View style={{ backgroundColor: theme.colors.surface, padding: 24, borderRadius: 16, width: '80%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>Add New Home</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: theme.colors.text }}
              placeholder="Home Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={homeName}
              onChangeText={setHomeName}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: theme.colors.text }}
              placeholder="Home Address"
              placeholderTextColor={theme.colors.textSecondary}
              value={homeAddress}
              onChangeText={setHomeAddress}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={handleModalCancel} style={{ padding: 10 }}>
                <Text style={{ color: theme.colors.textSecondary, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleModalAdd} style={{ padding: 10 }}>
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {homes.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}> 
            No homes added yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}> 
            Tap the + button to add your first home
          </Text>
        </View>
      )}

      <View style={styles.addHomeButtonContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddHome}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addHomeButtonContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 10,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  homeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeHeader: {
    marginBottom: 12,
  },
  homeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  homeAddress: {
    fontSize: 14,
  },
  homeStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    marginRight: 24,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  roomPreview: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  roomPreviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  roomPreviewText: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
