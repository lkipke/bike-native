import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {useSelector} from 'react-redux';

import {getCurrentStats} from '../../store/bluetooth';
import {HomeStackParamList} from '../types';

type Props = {
  navigation: StackNavigationProp<HomeStackParamList, 'Welcome'>;
};

let Welcome: React.FC<Props> = ({navigation}) => {
  let stats = useSelector(getCurrentStats);

  let displayStats = [
    [
      {
        label: 'Cadence',
        value: stats?.cadence,
      },
      {
        label: 'Power',
        value: stats?.power,
      },
      {
        label: 'Heart rate',
        value: stats?.heartRate,
      },
    ],
    [
      {
        label: 'Speed',
        value: stats?.speed,
      },
      {
        label: 'Calories',
        value: 0,
      },
    ],
  ];

  return (
    <SafeAreaView style={styles.homeContainer}>
      {stats ? (
        <View style={styles.statRowsContainer}>
          {displayStats.map((list, listIdx) => (
            <View key={listIdx} style={styles.statListContainer}>
              {list.map(({label, value}) => (
                <View key={label} style={styles.statContainer}>
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <View>
          <ActivityIndicator size="large" />
          <Text style={styles.connectingMessage}>Connecting to device...</Text>
        </View>
      )}
      <Button
        onPress={() => {}}
        icon={
          <Icon name="record" type="material-community" size={30} color="red" />
        }
        type="outline"
        title="Record"
        style={styles.recordButton}
      />
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRowsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  statListContainer: {
    flexDirection: 'row',
  },
  statContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  statValue: {
    fontSize: 80,
  },
  statLabel: {
    fontSize: 18,
  },
  recordButton: {
    marginTop: 20,
  },
  connectingMessage: {
    fontSize: 18,
    marginTop: 10,
  },
});
