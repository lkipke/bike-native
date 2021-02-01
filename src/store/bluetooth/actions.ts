import {Device, Actions, DeviceId} from './types';

export function addAvailableDevice(device: Device): Actions {
  return {
    type: 'bluetooth/addAvailableDevice',
    payload: device,
  };
}

export function removeAvailableDevice(deviceId: DeviceId): Actions {
  return {
    type: 'bluetooth/removeAvailableDevice',
    payload: deviceId,
  };
}

export function setSelectedDeviceId(deviceId: string | null): Actions {
  return {
    type: 'bluetooth/setSelectedDeviceId',
    payload: deviceId,
  };
}
