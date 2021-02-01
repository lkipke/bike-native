import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import {
  getAvailableDeviceIds,
  getDevicesById,
  getSelectedDeviceId,
} from '../../store/bluetooth';
import {useBluetooth} from '../Bluetooth';

let SelectableListItem: React.FC<{id: string}> = ({id}) => {
  let dispatch = useDispatch<AppDispatch>();
  let devicesById = useSelector(getDevicesById);
  let selectedDeviceId = useSelector(getSelectedDeviceId);

  let isConnected = id === selectedDeviceId;
  let device = devicesById[id];

  return (
    <ListItem
      topDivider
      bottomDivider
      onPress={() => {
        dispatch({
          type: 'bluetooth/setSelectedDeviceId',
          deviceId: isConnected ? null : device.id,
        });
      }}>
      <ListItem.Content>
        <ListItem.Title>{device.name}</ListItem.Title>
      </ListItem.Content>
      {isConnected && <Icon name="check" style={styles.checkmark} />}
    </ListItem>
  );
};

let BluetoothDeviceList = () => {
  useBluetooth();
  let deviceIds = useSelector(getAvailableDeviceIds);
  // let devices = [
  //   {id: 'abcd', name: 'foo'},
  //   {id: 'efgh', name: 'bar'},
  // ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available devices</Text>
      <View style={styles.list}>
        {deviceIds.length === 0 && <Text>No devices found</Text>}
        {deviceIds.map((id) => (
          <SelectableListItem key={id} id={id} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 17,
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingBottom: 16,
    fontWeight: '500',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  deviceName: {
    fontSize: 30,
  },
  checkmark: {
    fontSize: 25,
    position: 'absolute',
    right: 20,
    top: 11,
  },
});

export {BluetoothDeviceList};
