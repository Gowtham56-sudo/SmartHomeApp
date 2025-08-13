import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Home, Room, Device, VoltageReading, User } from '../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  HOMES: 'homes',
  ROOMS: 'rooms',
  DEVICES: 'devices',
  VOLTAGE_READINGS: 'voltage_readings'
};

// User Management
export const createUserProfile = async (user: User) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, user.id);
    const userData: any = {
      email: user.email,
      displayName: user.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    if (user.photoURL !== undefined) {
      userData.photoURL = user.photoURL;
    }
  const { setDoc } = await import('firebase/firestore');
  await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Home Management
export const createHome = async (homeData: Omit<Home, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const homeRef = await addDoc(collection(db, COLLECTIONS.HOMES), {
      ...homeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return homeRef.id;
  } catch (error) {
    console.error('Error creating home:', error);
    throw error;
  }
};

export const getUserHomes = async (userId: string): Promise<Home[]> => {
  try {
    const homesQuery = query(
      collection(db, COLLECTIONS.HOMES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(homesQuery);
    const homes: Home[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      homes.push({
        id: doc.id,
        name: data.name,
        address: data.address,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        rooms: data.rooms || []
      });
    });
    
    return homes;
  } catch (error) {
    console.error('Error getting user homes:', error);
    throw error;
  }
};

export const updateHome = async (homeId: string, updates: Partial<Home>) => {
  try {
    const homeRef = doc(db, COLLECTIONS.HOMES, homeId);
    await updateDoc(homeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating home:', error);
    throw error;
  }
};

export const deleteHome = async (homeId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.HOMES, homeId));
  } catch (error) {
    console.error('Error deleting home:', error);
    throw error;
  }
};

// Room Management
export const createRoom = async (roomData: Omit<Room, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const roomRef = await addDoc(collection(db, COLLECTIONS.ROOMS), {
      ...roomData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return roomRef.id;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const getHomeRooms = async (homeId: string): Promise<Room[]> => {
  try {
    const roomsQuery = query(
      collection(db, COLLECTIONS.ROOMS),
      where('homeId', '==', homeId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(roomsQuery);
    const rooms: Room[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rooms.push({
        id: doc.id,
        name: data.name,
        homeId: data.homeId,
        devices: data.devices || [],
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    return rooms;
  } catch (error) {
    console.error('Error getting home rooms:', error);
    throw error;
  }
};

export const updateRoom = async (roomId: string, updates: Partial<Room>) => {
  try {
    const roomRef = doc(db, COLLECTIONS.ROOMS, roomId);
    await updateDoc(roomRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ROOMS, roomId));
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// Device Management
export const createDevice = async (deviceData: Omit<Device, 'id'> & { roomId: string }): Promise<string> => {
  try {
    const deviceRef = await addDoc(collection(db, COLLECTIONS.DEVICES), {
      ...deviceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return deviceRef.id;
  } catch (error) {
    console.error('Error creating device:', error);
    throw error;
  }
};

export const getRoomDevices = async (roomId: string): Promise<Device[]> => {
  try {
    const devicesQuery = query(
      collection(db, COLLECTIONS.DEVICES),
      where('roomId', '==', roomId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(devicesQuery);
    const devices: Device[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      devices.push({
        id: doc.id,
        name: data.name,
        type: data.type,
        isOn: data.isOn || false,
        voltage: data.voltage || 0,
        current: data.current || 0,
        power: data.power || 0,
        ipAddress: data.ipAddress
      });
    });
    
    return devices;
  } catch (error) {
    console.error('Error getting room devices:', error);
    throw error;
  }
};

export const updateDevice = async (deviceId: string, updates: Partial<Device>) => {
  try {
    const deviceRef = doc(db, COLLECTIONS.DEVICES, deviceId);
    await updateDoc(deviceRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
};

export const toggleDevice = async (deviceId: string, isOn: boolean) => {
  try {
    const deviceRef = doc(db, COLLECTIONS.DEVICES, deviceId);
    await updateDoc(deviceRef, {
      isOn,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling device:', error);
    throw error;
  }
};

export const deleteDevice = async (deviceId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.DEVICES, deviceId));
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};

// Voltage Readings Management
export const addVoltageReading = async (deviceId: string, reading: Omit<VoltageReading, 'timestamp'>) => {
  try {
    await addDoc(collection(db, COLLECTIONS.VOLTAGE_READINGS), {
      deviceId,
      ...reading,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding voltage reading:', error);
    throw error;
  }
};

export const getDeviceReadings = async (deviceId: string, limit: number = 100): Promise<VoltageReading[]> => {
  try {
    const readingsQuery = query(
      collection(db, COLLECTIONS.VOLTAGE_READINGS),
      where('deviceId', '==', deviceId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(readingsQuery);
    const readings: VoltageReading[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      readings.push({
        timestamp: data.timestamp?.toMillis() || Date.now(),
        voltage: data.voltage,
        current: data.current,
        power: data.power
      });
    });
    
    return readings.slice(0, limit);
  } catch (error) {
    console.error('Error getting device readings:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToUserHomes = (userId: string, callback: (homes: Home[]) => void) => {
  const homesQuery = query(
    collection(db, COLLECTIONS.HOMES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(homesQuery, (querySnapshot) => {
    const homes: Home[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      homes.push({
        id: doc.id,
        name: data.name,
        address: data.address,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        rooms: data.rooms || []
      });
    });
    callback(homes);
  });
};

export const subscribeToRoomDevices = (roomId: string, callback: (devices: Device[]) => void) => {
  const devicesQuery = query(
    collection(db, COLLECTIONS.DEVICES),
    where('roomId', '==', roomId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(devicesQuery, (querySnapshot) => {
    const devices: Device[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      devices.push({
        id: doc.id,
        name: data.name,
        type: data.type,
        isOn: data.isOn || false,
        voltage: data.voltage || 0,
        current: data.current || 0,
        power: data.power || 0,
        ipAddress: data.ipAddress
      });
    });
    callback(devices);
  });
};
