import {useCallback, useEffect, useRef, useState} from 'react';
import {BleError, BleManager, Device, State} from 'react-native-ble-plx';
import {useDispatch, useSelector} from 'react-redux';
import {from, fromEvent, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {AppDispatch} from '../store';
import {DeviceId, getSelectedDeviceId} from '../store/bluetooth';

// UUIDs for BLE devices
const FITNESS_MACHINE_FEATURE_UUID = '00002acc-0000-1000-8000-00805f9b34fb';
const INDOOR_BIKE_DATA_UUID = '00002ad2-0000-1000-8000-00805f9b34fb';

let useBluetoothManager = () => {
  let manager = useRef<BleManager | null>(null);

  useEffect(() => {
    // TODO: figure out what to do to restore background state, if needed
    let instance = new BleManager({
      restoreStateIdentifier: 'bike-bluetooth-manager',
      restoreStateFunction: (restoredState) => {
        console.log(restoredState);
      },
    });
    manager.current = instance;

    return () => {
      instance.destroy();
    };
  }, []);

  return manager;
};

let useBluetooth = () => {
  // Redux store
  let selectedDeviceId = useSelector(getSelectedDeviceId);
  let dispatch = useDispatch<AppDispatch>();

  let manager = useBluetoothManager();
  let connectedDeviceId = useRef<DeviceId | null>();
  let [connectionState, setConnectionState] = useState<State>(State.Unknown);

  let deviceScanCallback = useCallback(
    (error: BleError | null, device: Device | null) => {
      if (error) {
        console.error('Error scanning for devices', error);
        return;
      }

      if (device && device.id && device.name) {
        // add the device info to redux so we can display it
        dispatch({
          type: 'bluetooth/addAvailableDevice',
          device: {id: device.id, name: device.name},
        });
      }
    },
    [dispatch],
  );

  // Wait for the bluetooth manager to be powered on
  useEffect(() => {
    let sub = manager.current?.onStateChange((state) => {
      if (state === State.PoweredOn) {
        manager.current?.startDeviceScan(null, null, deviceScanCallback);

        // don't endlessly look for devices
        // TODO: allow for refresh
        setTimeout(() => {
          manager.current?.stopDeviceScan();
        }, 10000);

        sub?.remove();
      }
    });
  }, [manager, deviceScanCallback]);

  useEffect(() => {
    if (connectionState === State.PoweredOn) {
      manager.current?.startDeviceScan(null, null, deviceScanCallback);

      // don't endlessly look for devices
      // TODO: allow for refresh
      setTimeout(() => {
        manager.current?.stopDeviceScan();
      }, 10000);
    }
  }, [manager, deviceScanCallback]);

  useEffect(() => {
    if (!selectedDeviceId) {
      return;
    }

    // cancel a previous connection, if it had one
    if (selectedDeviceId !== connectedDeviceId.current) {
      if (connectedDeviceId.current) {
        console.log('cancelling previous connection');
        manager.current?.cancelDeviceConnection(connectedDeviceId.current);
      }
      connectedDeviceId.current = selectedDeviceId;
    }

    console.log('found selected device id', selectedDeviceId);

    manager.current
      ?.connectToDevice(selectedDeviceId)
      .then((device) => {
        console.log('connected!');
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        console.log(
          'device service data',
          device.localName,
          device.name,
          device.serviceUUIDs,
          device.overflowServiceUUIDs,
        );

        device.monitorCharacteristicForService(
          FITNESS_MACHINE_FEATURE_UUID,
          INDOOR_BIKE_DATA_UUID,
        );
        // device.readCharacteristicForService('fitness_machine', )
        // console.log(device.)
      })
      .catch((error) => {
        console.error('ERROR', error);
      });
  }, [manager, selectedDeviceId, dispatch]);
};

export {useBluetooth};

// const getEpoch = () => Math.round(Date.now() / 1000);

// const observe = async (serviceId, characteristicId) => {
//     let options = {
//         filters: [{ services: [serviceId] }],
//     };
//     const device = await navigator.bluetooth.requestDevice(options);
//     const server = await device.gatt.connect();
//     const service = await server.getPrimaryService(serviceId);
//     const characteristic = await service.getCharacteristic(characteristicId);

//      await characteristic.startNotifications();
//      return fromEvent(characteristic, 'characteristicvaluechanged');
// };

// const parseBikeData = (value) => {
//     const result = {};

//     result.flags = value.getUint16(0, true).toString(2);
//     result.speed = value.getUint16(2, true) / 100;
//     result.cadence = value.getUint16(4, true) / 2;
//     result.power = value.getInt16(6, true);
//     result.heartRate = value.getUint8(8, true);
//     result.time = getEpoch();

//     return result;
// };

// export const connect = () => {
//     // random data for debugging
//     if (true) {
//         const rnd = (max) => Math.floor(Math.random() * Math.floor(max));
//         return new Observable((subject) => {
//             setInterval(() => {
//                 subject.next({
//                     speed: rnd(20),
//                     cadence: rnd(100),
//                     power: rnd(400),
//                     heartRate: rnd(180),
//                     time: getEpoch(),
//                 });
//             }, 200);
//         });
//     }

//     return from(observe('fitness_machine', 'indoor_bike_data')).pipe(
//         switchMap((sub) => sub),
//         map((e) => e.target.value),
//         map((raw) => parseBikeData(raw))
//     );
// };
