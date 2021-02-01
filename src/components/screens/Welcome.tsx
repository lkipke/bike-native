import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StyleSheet, Button} from 'react-native';
import {HomeStackParamList} from '../types';
// import {Bluetooth} from './Bluetooth';

type Props = {
  navigation: StackNavigationProp<HomeStackParamList, 'Welcome'>;
};

let Welcome: React.FC<Props> = ({navigation}) => (
  <SafeAreaView style={styles.homeContainer}>
    <Button
      title="Start Workout"
      onPress={() => {
        navigation.navigate('Workout');
      }}
    />
  </SafeAreaView>
);

export default Welcome;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
