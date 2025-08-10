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
import { Home, Room, Device } from '../types';

const RoomsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { home } = route.params;
  const { theme } = useTheme();
  const [rooms, setRooms] = useState<Room[]>(home.rooms || []);

  const handleAddRoom = () => {
    Alert.prompt(
      'Add New Room',
      'Enter room name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (name) => {
            if (name && name.trim()) {
              const newRoom: Room = {
                id: Date.now().toString(),
                name: name.trim(),
                homeId: home.id,
                devices: [],
                createdAt: new Date(),
              };
              setRooms([...rooms, newRoom]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleDeleteRoom = (roomId: string) => {
    Alert.alert(
      'Delete Room',
      'Are you sure you want to delete this room? All devices in this room will also be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRooms(rooms.filter(room => room.id !== roomId));
          },
        },
      ]
    );
  };

  const renderRoomCard = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={[styles.roomCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('Devices', { room: item, home })}
    >
      <View style={styles.roomHeader}>
        <View style={styles.roomInfo}>
          <Text style={[styles.roomName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.deviceCount, { color: theme.colors.textSecondary }]}>
            {item.devices.length} device{item.devices.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={() => handleDeleteRoom(item.id)}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.surface }]}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.devicePreview}>
        {item.devices.length > 0 ? (
          <View style={styles.deviceList}>
            {item.devices.slice(0, 3).map((device) => (
              <View key={device.id} style={styles.deviceItem}>
                <View style={[styles.deviceStatus, { backgroundColor: device.isOn ? theme.colors.success : theme.colors.textSecondary }]} />
                <Text style={[styles.deviceName, { color: theme.colors.text }]}>{device.name}</Text>
              </View>
            ))}
            {item.devices.length > 3 && (
              <Text style={[styles.moreDevices, { color: theme.colors.textSecondary }]}>
                +{item.devices.length - 3} more
              </Text>
            )}
          </View>
        ) : (
          <Text style={[styles.noDevices, { color: theme.colors.textSecondary }]}>
            No devices added yet
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{home.name}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddRoom}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {rooms.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No rooms added yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
            Tap the + button to add your first room
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
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  roomCard: {
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
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceCount: {
    fontSize: 14,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  devicePreview: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  deviceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  deviceStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  deviceName: {
    fontSize: 14,
  },
  moreDevices: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  noDevices: {
    fontSize: 14,
    fontStyle: 'italic',
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

export default RoomsScreen;
