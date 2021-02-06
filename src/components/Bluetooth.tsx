import {useCallback, useEffect, useRef} from 'react';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  State,
} from 'react-native-ble-plx';
import {useDispatch} from 'react-redux';
import {decode} from 'base64-arraybuffer';

import {AppDispatch} from '../store';
import {BluetoothData} from './types';

// UUIDs for BLE devices
const FITNESS_MACHINE_FEATURE_UUID = '1826';
const INDOOR_BIKE_DATA_UUID = '2ad2';

const getEpoch = () => Math.round(Date.now() / 1000);

function parseBikeData(
  input: [BleError | null, Characteristic | null],
): BluetoothData | undefined {
  let [error, characteristic] = input;
  if (error || !characteristic?.value) {
    return;
  }

  let data = new DataView(decode(characteristic.value));
  return {
    flags: data.getUint16(0, true).toString(2),
    speed: data.getUint16(2, true) / 100,
    cadence: data.getUint16(4, true) / 2,
    power: data.getInt16(6, true),
    heartRate: data.getUint8(8),
    time: getEpoch(),
  };
}

let useBluetooth = () => {
  let manager = useRef<BleManager | null>(null);
  let bikeDevice = useRef<Device | null>(null);
  let dispatch = useDispatch<AppDispatch>();

  let deviceScanCallback = useCallback(
    (error: BleError | null, device: Device | null) => {
      if (error || !device) {
        return;
      }

      if (device.name === 'IC Bike') {
        manager.current?.stopDeviceScan();

        device
          .connect()
          .then((connectedDevice) =>
            connectedDevice.discoverAllServicesAndCharacteristics(),
          )
          .then((connectedDevice) => {
            bikeDevice.current = connectedDevice;
            dispatch({
              type: 'bluetooth/toggleConnected',
              isConnected: true,
            });

            let startTime = Date.now();
            connectedDevice.monitorCharacteristicForService(
              FITNESS_MACHINE_FEATURE_UUID,
              INDOOR_BIKE_DATA_UUID,
              (...args) => {
                let time = Date.now();

                // throttle to every 1 second
                if (time - startTime >= 1000) {
                  startTime = time;
                  let data = parseBikeData(args);
                  if (data) {
                    dispatch({
                      type: 'bluetooth/addStats',
                      stats: data,
                    });
                  }
                }
              },
            );
          })
          .catch((connectionError) =>
            console.error(
              'error connecting with device',
              device,
              connectionError,
            ),
          );
      }
    },
    [dispatch],
  );

  // Create the manager
  useEffect(() => {
    let instance = new BleManager();
    manager.current = instance;
    let subscription = manager.current.onStateChange((state) => {
      if (state === State.PoweredOn) {
        manager.current?.startDeviceScan(null, null, deviceScanCallback);
        subscription.remove();
      }
    });

    return () => {
      instance.destroy();
    };
  }, [deviceScanCallback]);
};

export {useBluetooth};
