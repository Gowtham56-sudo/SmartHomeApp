import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Room, Device } from '../types';

interface WiFiNetwork {
  ssid: string;
  signalStrength: number;
  isConnected: boolean;
}

const AddDeviceScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const room = route?.params?.room;
  const home = route?.params?.home;
  const { theme } = useTheme();
  const [step, setStep] = useState<'scan' | 'connect' | 'configure'>('scan');
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<'light' | 'fan' | 'switch'>('light');

  // Mock WiFi networks for demonstration
  useEffect(() => {
    if (step === 'scan') {
      scanNetworks();
    }
  }, [step]);

  const scanNetworks = async () => {
    setScanning(true);
    // Simulate network scanning
    setTimeout(() => {
      const mockNetworks: WiFiNetwork[] = [
        { ssid: 'HomeWiFi', signalStrength: 85, isConnected: true },
        { ssid: 'ESP8266_Device_001', signalStrength: 72, isConnected: false },
        { ssid: 'ESP8266_Device_002', signalStrength: 68, isConnected: false },
        { ssid: 'NeighborWiFi', signalStrength: 45, isConnected: false },
        { ssid: 'ESP8266_Light_001', signalStrength: 78, isConnected: false },
      ];
      setNetworks(mockNetworks);
      setScanning(false);
    }, 2000);
  };

  const handleNetworkSelect = (network: WiFiNetwork) => {
    if (network.ssid.startsWith('ESP8266')) {
      setSelectedNetwork(network);
      setStep('connect');
    } else {
      Alert.alert('Invalid Network', 'Please select an ESP8266 device network.');
    }
  };

  const handleConnect = async () => {
    if (!selectedNetwork || !password) {
      Alert.alert('Error', 'Please enter the network password.');
      return;
    }

    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setStep('configure');
    }, 3000);
  };

  const handleAddDevice = () => {
    if (!deviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name.');
      return;
    }

    const newDevice: Device = {
      id: Date.now().toString(),
      name: deviceName.trim(),
      type: deviceType,
      isOn: false,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      voltage: 120,
      current: 0,
      power: 0,
    };

    // Here you would save the device to Firebase
    Alert.alert('Success', 'Device added successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  const renderNetworkItem = ({ item }: { item: WiFiNetwork }) => (
    <TouchableOpacity
      style={[
        styles.networkItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: selectedNetwork?.ssid === item.ssid ? theme.colors.primary : theme.colors.border,
        },
      ]}
      onPress={() => handleNetworkSelect(item)}
    >
      <View style={styles.networkInfo}>
        <Text style={[styles.networkName, { color: theme.colors.text }]}>{item.ssid}</Text>
        <Text style={[styles.networkSignal, { color: theme.colors.textSecondary }]}>
          Signal: {item.signalStrength}%
        </Text>
      </View>
      {item.isConnected && (
        <Text style={[styles.connectedText, { color: theme.colors.success }]}>Connected</Text>
      )}
    </TouchableOpacity>
  );

  const renderScanStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Scan for ESP8266 Devices</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Looking for available ESP8266 devices on your network...
      </Text>

      {scanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.scanningText, { color: theme.colors.textSecondary }]}>
            Scanning for devices...
          </Text>
        </View>
      ) : (
        <FlatList
          data={networks}
          renderItem={renderNetworkItem}
          keyExtractor={(item) => item.ssid}
          style={styles.networkList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
        onPress={scanNetworks}
        disabled={scanning}
      >
        <Text style={[styles.scanButtonText, { color: theme.colors.surface }]}>
          {scanning ? 'Scanning...' : 'Scan Again'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderConnectStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Connect to Device</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Enter the password for {selectedNetwork?.ssid}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Network Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleConnect}
        disabled={connecting}
      >
        {connecting ? (
          <ActivityIndicator color={theme.colors.surface} />
        ) : (
          <Text style={[styles.connectButtonText, { color: theme.colors.surface }]}>Connect</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderConfigureStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Configure Device</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Set up your new device
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Device Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder="e.g., Living Room Light"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Device Type</Text>
        <View style={styles.typeContainer}>
          {(['light', 'fan', 'switch'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                {
                  backgroundColor: deviceType === type ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setDeviceType(type)}
            >
              <Text style={[styles.typeButtonText, { color: deviceType === type ? theme.colors.surface : theme.colors.text }]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.success }]}
        onPress={handleAddDevice}
      >
        <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>Add Device</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Add Device</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'scan' && renderScanStep()}
        {step === 'connect' && renderConnectStep()}
        {step === 'configure' && renderConfigureStep()}
      </ScrollView>
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    marginBottom: 32,
  },
  scanningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  scanningText: {
    marginTop: 16,
    fontSize: 16,
  },
  networkList: {
    marginBottom: 20,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  networkSignal: {
    fontSize: 14,
  },
  connectedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scanButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddDeviceScreen;
