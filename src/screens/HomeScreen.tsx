import React, { useState, useEffect } from 'react';
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

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [homes, setHomes] = useState<Home[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadHomes();
  }, []);

  const loadHomes = () => {
    // Mock data - replace with actual Firebase data
    const mockHomes: Home[] = [
      {
        id: '1',
        name: 'Main House',
        address: '123 Main St, City',
        userId: 'user1',
        createdAt: new Date(),
        rooms: [
          { id: '1', name: 'Living Room', homeId: '1', devices: [], createdAt: new Date() },
          { id: '2', name: 'Kitchen', homeId: '1', devices: [], createdAt: new Date() },
          { id: '3', name: 'Bedroom', homeId: '1', devices: [], createdAt: new Date() },
        ],
      },
      {
        id: '2',
        name: 'Vacation Home',
        address: '456 Beach Rd, Resort',
        userId: 'user1',
        createdAt: new Date(),
        rooms: [
          { id: '4', name: 'Master Bedroom', homeId: '2', devices: [], createdAt: new Date() },
          { id: '5', name: 'Kitchen', homeId: '2', devices: [], createdAt: new Date() },
        ],
      },
    ];
    setHomes(mockHomes);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHomes();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddHome = () => {
    Alert.prompt(
      'Add New Home',
      'Enter home name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (name) => {
            if (name && name.trim()) {
              const newHome: Home = {
                id: Date.now().toString(),
                name: name.trim(),
                address: '',
                userId: 'user1',
                createdAt: new Date(),
                rooms: [],
              };
              setHomes([...homes, newHome]);
            }
          },
        },
      ],
      'plain-text'
    );
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
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddHome}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={homes}
        renderItem={renderHomeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
