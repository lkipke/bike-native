import {Actions, BluetoothState} from './types';

let initialState: BluetoothState = {
  devicesById: {},
  selectedDeviceId: null,
  cadence: [],
  speed: [],
  timestamps: [],
  heartRate: [],
  power: [],
  currentStats: null,
  isConnected: false,
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
    case 'bluetooth/addStats':
      let {cadence, speed, heartRate, power, time} = action.stats;
      return {
        ...state,
        cadence: [...state.cadence, cadence],
        speed: [...state.speed, speed],
        heartRate: [...state.heartRate, heartRate],
        power: [...state.power, power],
        timestamps: [...state.timestamps, time],
        currentStats: action.stats,
      };
    case 'bluetooth/toggleConnected':
      return {
        ...state,
        isConnected: action.isConnected,
      };
    default:
      return state;
  }
}
