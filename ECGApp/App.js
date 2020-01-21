import React from 'react';
import { SafeAreaView, View, Text, StatusBar } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import GraphScreen from './components/GraphScreen.js';
import HealthScreen from './components/HealthScreen.js';
import SettingScreen from './components/SettingScreen.js';

const TabNavigator = createBottomTabNavigator(
  {
    Graph: { screen: GraphScreen },
    Health: { screen: HealthScreen },
    Settings: { screen: SettingScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Graph') {
          iconName = 'ios-pulse';
        }
        else if (routeName === 'Health') {
          iconName = 'ios-heart';
        }
        else if (routeName === 'Settings') {
          iconName = 'ios-options';
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'dodgerblue',
      inactiveTintColor: 'gray',
    },
  }
);

export default createAppContainer(TabNavigator);