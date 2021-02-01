import {useCallback, useEffect, useRef, useState} from 'react';
import {BleError, BleManager, Device, State} from 'react-native-ble-plx';
import {useDispatch, useSelector} from 'react-redux';
import {from, fromEvent, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {AppDispatch} from '../store';
import {DeviceId, getSelectedDeviceId} from '../store/bluetooth';

// UUIDs for BLE devices
// const FITNESS_MACHINE_FEATURE_UUID = '00002acc-0000-1000-8000-00805f9b34fb';
// const INDOOR_BIKE_DATA_UUID = '00002ad2-0000-1000-8000-00805f9b34fb';

let useBluetooth = () => {
  // Redux store
  let selectedDeviceId = useSelector(getSelectedDeviceId);
  let dispatch = useDispatch<AppDispatch>();

  // BLE Manager
  let manager = useRef<BleManager | null>(null);
  let devices = useRef<Record<DeviceId, Device>>({});
  let [connectionState, setConnectionState] = useState<State>(State.Unknown);

  useEffect(() => {
    // TODO: figure out what to do to restore background state, if needed
    manager.current = new BleManager({
      restoreStateIdentifier: 'bike-bluetooth-manager',
      restoreStateFunction: (restoredState) => {
        console.log(restoredState);
      },
    });

    let sub = manager.current.onStateChange((state) => {
      setConnectionState(state);
      sub.remove();
    });

    // destroy the instance when this component unmounts
    return () => {
      setConnectionState(State.Unknown);
      manager.current?.destroy();
    };
  }, []);

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

  useEffect(() => {
    console.log('connection state change', connectionState);
    if (connectionState === State.PoweredOn && manager.current) {
      console.log('starting scan');

      manager.current.startDeviceScan(null, null, deviceScanCallback);

      // don't endlessly look for devices
      // TODO: allow for refresh
      setTimeout(() => {
        manager.current?.stopDeviceScan();
      }, 20000);
    }
  }, [connectionState, deviceScanCallback]);

  useEffect(() => {
    if (selectedDeviceId) {
      let device = devices.current[selectedDeviceId];
      if (device) {
        device
          .connect()
          .then((connected) => {
            return connected.discoverAllServicesAndCharacteristics();
          })
          .then((characteristics) => {
            console.log('characteristics', characteristics);
          })
          .catch((error) => {
            console.error('ERROR', error);
          });
      } else {
        // remove any devices that we don't have a reference for
        dispatch({
          type: 'bluetooth/removeAvailableDevice',
          deviceId: selectedDeviceId,
        });
      }
    }
  }, [selectedDeviceId, dispatch]);
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

// await characteristic.startNotifications();
// return fromEvent(characteristic, 'characteristicvaluechanged');
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
