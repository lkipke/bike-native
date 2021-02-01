import {Actions, BluetoothState} from './types';

let initialState: BluetoothState = {
  devicesById: {},
  selectedDeviceId: null,
};

export function bluetoothReducer(state = initialState, action: Actions) {
  switch (action.type) {
    case 'bluetooth/addAvailableDevice':
      let {devicesById} = state;
      let {device} = action;

      if (devicesById[device.id]) {
        return state;
      }

      return {
        ...state,
        devicesById: {
          ...devicesById,
          [device.id]: device,
        },
      };
    case 'bluetooth/setSelectedDeviceId':
      return {
        ...state,
        selectedDeviceId: action.deviceId,
      };
    default:
      return state;
  }
}
