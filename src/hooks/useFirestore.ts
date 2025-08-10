import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getUserHomes, 
  createHome, 
  updateHome, 
  deleteHome,
  subscribeToUserHomes,
  getHomeRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomDevices,
  createDevice,
  updateDevice,
  toggleDevice,
  deleteDevice,
  subscribeToRoomDevices
} from '../services/firestore';
import { Home, Room, Device } from '../types';

// Hook for managing homes
export const useHomes = () => {
  const { user } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHomes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserHomes(user.id, (updatedHomes) => {
      setHomes(updatedHomes);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addHome = async (name: string, address: string) => {
    if (!user) return;
    
    try {
      await createHome({
        name,
        address,
        userId: user.id,
        rooms: []
      });
    } catch (error) {
      console.error('Error adding home:', error);
      throw error;
    }
  };

  const editHome = async (homeId: string, updates: Partial<Home>) => {
    try {
      await updateHome(homeId, updates);
    } catch (error) {
      console.error('Error updating home:', error);
      throw error;
    }
  };

  const removeHome = async (homeId: string) => {
    try {
      await deleteHome(homeId);
    } catch (error) {
      console.error('Error deleting home:', error);
      throw error;
    }
  };

  return {
    homes,
    loading,
    addHome,
    editHome,
    removeHome
  };
};

// Hook for managing rooms
export const useRooms = (homeId: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!homeId) {
      setRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const loadRooms = async () => {
      try {
        const roomsData = await getHomeRooms(homeId);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error loading rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [homeId]);

  const addRoom = async (name: string) => {
    try {
      await createRoom({
        name,
        homeId,
        devices: []
      });
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  };

  const editRoom = async (roomId: string, updates: Partial<Room>) => {
    try {
      await updateRoom(roomId, updates);
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  const removeRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  };

  return {
    rooms,
    loading,
    addRoom,
    editRoom,
    removeRoom
  };
};

// Hook for managing devices
export const useDevices = (roomId: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) {
      setDevices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToRoomDevices(roomId, (updatedDevices) => {
      setDevices(updatedDevices);
      setLoading(false);
    });

    return unsubscribe;
  }, [roomId]);

  const addDevice = async (deviceData: Omit<Device, 'id'>) => {
    try {
      await createDevice({
        ...deviceData,
        roomId
      });
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  };

  const editDevice = async (deviceId: string, updates: Partial<Device>) => {
    try {
      await updateDevice(deviceId, updates);
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  };

  const toggleDeviceState = async (deviceId: string, isOn: boolean) => {
    try {
      await toggleDevice(deviceId, isOn);
    } catch (error) {
      console.error('Error toggling device:', error);
      throw error;
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      await deleteDevice(deviceId);
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  };

  return {
    devices,
    loading,
    addDevice,
    editDevice,
    toggleDeviceState,
    removeDevice
  };
};
