import {BluetoothData} from '../../components/types';
import {Device, Actions, DeviceId} from './types';

export function addAvailableDevice(device: Device): Actions {
  return {
    type: 'bluetooth/addAvailableDevice',
    device,
  };
}

export function removeAvailableDevice(deviceId: DeviceId): Actions {
  return {
    type: 'bluetooth/removeAvailableDevice',
    deviceId,
  };
}

export function setSelectedDeviceId(deviceId: string | null): Actions {
  return {
    type: 'bluetooth/setSelectedDeviceId',
    deviceId,
  };
}

export function addStats(data: BluetoothData): Actions {
  return {
    type: 'bluetooth/addStats',
    stats: data,
  };
}

export function toggleConnected(isConnected: boolean): Actions {
  return {
    type: 'bluetooth/toggleConnected',
    isConnected: isConnected,
  };
}
