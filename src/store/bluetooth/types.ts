import {BluetoothData} from '../../components/types';

export type DeviceId = string;

export interface Device {
  id: DeviceId;
  name: string | null;
}

interface AddAvailableDeviceAction {
  type: 'bluetooth/addAvailableDevice';
  device: Device;
}

interface RemoveAvailableDeviceAction {
  type: 'bluetooth/removeAvailableDevice';
  deviceId: DeviceId;
}

interface AddDataAction {
  type: 'bluetooth/addStats';
  stats: BluetoothData;
}

interface SetSelectedDeviceIdAction {
  type: 'bluetooth/setSelectedDeviceId';
  deviceId: DeviceId | null;
}

interface ToggleConnectedAction {
  type: 'bluetooth/toggleConnected';
  isConnected: boolean;
}

export type Actions =
  | AddAvailableDeviceAction
  | RemoveAvailableDeviceAction
  | SetSelectedDeviceIdAction
  | AddDataAction
  | ToggleConnectedAction;

export interface BluetoothState {
  selectedDeviceId: DeviceId | null;
  devicesById: Record<DeviceId, Device>;
  currentStats: BluetoothData | null;
  cadence: number[];
  speed: number[];
  timestamps: number[];
  heartRate: number[];
  power: number[];
  isConnected: boolean;
}
