export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Home {
  id: string;
  name: string;
  address: string;
  userId: string;
  createdAt: Date;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  homeId: string;
  devices: Device[];
  createdAt: Date;
}

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'switch';
  isOn: boolean;
  voltage: number;
  current: number;
  power: number;
  ipAddress?: string;
}

export interface VoltageReading {
  timestamp: number;
  voltage: number;
  current: number;
  power: number;
}

export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
  };
}
