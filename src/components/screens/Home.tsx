import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {HomeStackParamList} from '../types';
import Welcome from './Welcome';
import Workout from './Workout';

let Stack = createStackNavigator<HomeStackParamList>();

let NavigationWrapper = () => (
  <Stack.Navigator initialRouteName="Welcome">
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      options={{
        title: 'Home',
      }}
    />
    <Stack.Screen
      name="Workout"
      component={Workout}
      options={{
        title: 'Workout',
      }}
    />
  </Stack.Navigator>
);

export default NavigationWrapper;
