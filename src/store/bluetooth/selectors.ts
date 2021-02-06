import {RootState} from '..';

export let getSelectedDeviceId = (state: RootState) =>
  state.bluetooth.selectedDeviceId;

export let getAvailableDeviceIds = (state: RootState) =>
  Object.keys(state.bluetooth.devicesById);

export let getDevicesById = (state: RootState) => state.bluetooth.devicesById;

export let getCurrentStats = (state: RootState) => state.bluetooth.currentStats;
