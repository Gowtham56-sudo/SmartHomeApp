import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Room, Device } from '../types';

const { width } = Dimensions.get('window');

const DevicesScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { room, home } = route.params;
  const { theme } = useTheme();
  const [devices, setDevices] = useState<Device[]>(room.devices || []);
  const [switchAnimations] = useState<{ [key: string]: Animated.Value }>({});

  // Mock devices for demonstration
  useEffect(() => {
    if (devices.length === 0) {
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'Living Room Light',
          type: 'light',
          roomId: room.id,
          isOn: false,
          ipAddress: '192.168.1.100',
          ssid: 'HomeWiFi',
          voltage: 120,
          current: 0.5,
          power: 60,
          createdAt: new Date(),
          lastUpdated: new Date(),
        },
        {
          id: '2',
          name: 'Ceiling Fan',
          type: 'fan',
          roomId: room.id,
          isOn: true,
          ipAddress: '192.168.1.101',
          ssid: 'HomeWiFi',
          voltage: 120,
          current: 1.2,
          power: 144,
          createdAt: new Date(),
          lastUpdated: new Date(),
        },
        {
          id: '3',
          name: 'Table Lamp',
          type: 'light',
          roomId: room.id,
          isOn: false,
          ipAddress: '192.168.1.102',
          ssid: 'HomeWiFi',
          voltage: 120,
          current: 0.3,
          power: 36,
          createdAt: new Date(),
          lastUpdated: new Date(),
        },
      ];
      setDevices(mockDevices);
    }
  }, []);

  const toggleDevice = async (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, isOn: !device.isOn, lastUpdated: new Date() }
          : device
      )
    );

    // Animate the switch
    if (!switchAnimations[deviceId]) {
      switchAnimations[deviceId] = new Animated.Value(0);
    }

    Animated.spring(switchAnimations[deviceId], {
      toValue: 1,
      useNativeDriver: false,
    }).start(() => {
      switchAnimations[deviceId].setValue(0);
    });

    // Here you would send the command to the ESP8266 device
    // await sendCommandToDevice(deviceId, !device.isOn);
  };

  const handleAddDevice = () => {
    navigation.navigate('AddDevice', { room, home });
  };

  const handleDeleteDevice = (deviceId: string) => {
    Alert.alert(
      'Delete Device',
      'Are you sure you want to delete this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDevices(devices.filter(device => device.id !== deviceId));
          },
        },
      ]
    );
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light':
        return '💡';
      case 'fan':
        return '🌀';
      case 'switch':
        return '🔌';
      default:
        return '⚡';
    }
  };

  const renderDeviceCard = ({ item }: { item: Device }) => (
    <View style={[styles.deviceCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceIcon}>{getDeviceIcon(item.type)}</Text>
          <View style={styles.deviceDetails}>
            <Text style={[styles.deviceName, { color: theme.colors.text }]}>{item.name}</Text>
            <Text style={[styles.deviceType, { color: theme.colors.textSecondary }]}>{item.type}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={() => handleDeleteDevice(item.id)}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.surface }]}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.deviceStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Voltage</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.voltage}V</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Current</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.current}A</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Power</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.power}W</Text>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Status</Text>
        <TouchableOpacity
          style={[
            styles.switch,
            {
              backgroundColor: item.isOn ? theme.colors.success : theme.colors.textSecondary,
              transform: [
                {
                  scale: switchAnimations[item.id]
                    ? switchAnimations[item.id].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      })
                    : 1,
                },
              ],
            },
          ]}
          onPress={() => toggleDevice(item.id)}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.switchKnob,
              {
                backgroundColor: theme.colors.surface,
                transform: [
                  {
                    translateX: item.isOn ? 24 : 2,
                  },
                ],
              },
            ]}
          />
        </TouchableOpacity>
        <Text style={[styles.switchStatus, { color: item.isOn ? theme.colors.success : theme.colors.textSecondary }]}>
          {item.isOn ? 'ON' : 'OFF'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{room.name}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddDevice}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        renderItem={renderDeviceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {devices.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No devices added yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
            Tap the + button to add your first device
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
  deviceCard: {
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
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    textTransform: 'capitalize',
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
  deviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  switchStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
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

export default DevicesScreen;
