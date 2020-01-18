import React from 'react';
import { SafeAreaView, View, Text, StatusBar } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import GraphScreen from './components/GraphScreen.js';
import HealthScreen from './components/HealthScreen.js';
import SettingScreen from './components/SettingScreen.js';


const TabNavigator = createBottomTabNavigator({
    Graph: { screen: GraphScreen },
    Health: { screen: HealthScreen },
    Settings: { screen: SettingScreen },
  },
);

export default createAppContainer(TabNavigator);