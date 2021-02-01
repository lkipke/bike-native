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

interface SetSelectedDeviceIdAction {
  type: 'bluetooth/setSelectedDeviceId';
  deviceId: DeviceId | null;
}

export type Actions =
  | AddAvailableDeviceAction
  | RemoveAvailableDeviceAction
  | SetSelectedDeviceIdAction;

export interface BluetoothState {
  selectedDeviceId: DeviceId | null;
  devicesById: Record<DeviceId, Device>;
}
