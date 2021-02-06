import 'react-native-gesture-handler';
import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

import {store} from './src/store';
import Home from './src/components/screens/Home';
import UserScreen from './src/components/screens/User';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useBluetooth} from './src/components/Bluetooth';

declare const global: {HermesInternal: null | {}};

let BottomTab = createBottomTabNavigator();

const AppWithProviders = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </Provider>
);

const App = () => {
  useBluetooth();

  return (
    <NavigationContainer>
      <BottomTab.Navigator
        tabBarOptions={
          {
            // activeTintColor: '#e91e63',
          }
        }>
        <BottomTab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <BottomTab.Screen
          name="User"
          component={UserScreen}
          options={{
            tabBarLabel: 'User',
            tabBarIcon: ({color, size}) => (
              <Icon name="user" color={color} size={size} />
            ),
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

export default AppWithProviders;
