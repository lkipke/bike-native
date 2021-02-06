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
