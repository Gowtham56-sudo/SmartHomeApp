import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Home, Room, Device } from '../types';
import { useRooms } from '../hooks/useFirestore';

const RoomsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { home } = route.params;
  const { theme } = useTheme();
  const { rooms, addRoom, removeRoom, loading } = useRooms(home.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [inputError, setInputError] = useState('');

  const handleAddRoom = () => {
    if (!roomName.trim()) {
      setInputError('Room name is required');
      return;
    }
    addRoom(roomName.trim())
      .then(() => {
        setRoomName('');
        setInputError('');
        setModalVisible(false);
      })
      .catch((error) => {
        setInputError('Failed to add room');
      });
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
            removeRoom(roomId);
          },
        },
      ]
    );
  };

  const [roomDeviceStates, setRoomDeviceStates] = useState<{
    [roomId: string]: { [deviceId: string]: boolean }
  }>({});

  // Initialize device states for switches
  useEffect(() => {
    const initialStates: { [roomId: string]: { [deviceId: string]: boolean } } = {};
    rooms.forEach(room => {
      initialStates[room.id] = {};
      room.devices.forEach(device => {
        initialStates[room.id][device.id] = device.isOn || false;
      });
    });
    setRoomDeviceStates(initialStates);
  }, [rooms]);

  const handleToggleDevice = (roomId: string, deviceId: string) => {
    setRoomDeviceStates(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [deviceId]: !prev[roomId][deviceId],
      },
    }));
    // Optionally, update Firestore/device state here
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
          style={[styles.deleteButton, { backgroundColor: theme.colors.notification }]}
          onPress={() => handleDeleteRoom(item.id)}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.surface }]}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.devicePreview}>
        {item.devices.length > 0 ? (
          <View style={styles.deviceList}>
            {item.devices.slice(0, 3).map((device) => {
              const isOn = roomDeviceStates[item.id]?.[device.id] || false;
              return (
                <View key={device.id} style={styles.deviceItem}>
                  <TouchableOpacity
                    style={[styles.physicalSwitch, isOn ? styles.switchOn : styles.switchOff]}
                    activeOpacity={0.7}
                    onPress={() => handleToggleDevice(item.id, device.id)}
                  >
                    <Animated.View style={[styles.switchKnob, isOn ? styles.knobOn : styles.knobOff]} />
                    <Text style={[styles.switchLabel, isOn ? styles.labelOn : styles.labelOff]}>{isOn ? 'ON' : 'OFF'}</Text>
                  </TouchableOpacity>
                  <Text style={[styles.deviceName, { color: theme.colors.text, marginLeft: 12 }]}>{device.name}</Text>
                </View>
              );
            })}
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
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>No rooms added yet</Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Tap the + button to add your first room</Text>
        </View>
      )}

      {/* Add Room Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add New Room</Text>
              <TextInput
                style={[styles.modalInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Enter room name"
                placeholderTextColor={theme.colors.textSecondary}
                value={roomName}
                onChangeText={text => { setRoomName(text); setInputError(''); }}
                autoFocus
              />
              {inputError ? (
                <Text style={[styles.inputError, { color: theme.colors.notification }]}>{inputError}</Text>
              ) : null}
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.colors.notification }]} onPress={() => { setModalVisible(false); setRoomName(''); setInputError(''); }}>
                  <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddRoom}>
                  <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Floating Add Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.fabText, { color: theme.colors.surface }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  physicalSwitch: {
    width: 60,
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  switchOn: {
    backgroundColor: '#c8f7c5',
    borderColor: '#4cd964',
  },
  switchOff: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 4,
    left: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  knobOn: {
    left: 32,
    backgroundColor: '#4cd964',
  },
  knobOff: {
    left: 4,
    backgroundColor: '#fff',
  },
  switchLabel: {
    marginLeft: 32,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#888',
  },
  labelOn: {
    color: '#4cd964',
  },
  labelOff: {
    color: '#888',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: 320,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  inputError: {
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
