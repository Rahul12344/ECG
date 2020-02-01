import React from 'react';
import { SafeAreaView, View, Text, StatusBar } from 'react-native';

import Home from './screens/Home';

export default class App extends React.Component {

  _mounted = false;

  state = {
    bluetoothManager: null,
  };

  setDevice = BLEmanager => () => {
    if(this._mounted){
      this.setState({ bluetoothManager: BLEmanager });
    }
  };

  componentDidMount(){
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
  return (
      <Home screenProps={{ setDevice: this.setDevice, currentDevice: this.state.bluetoothManager}}/>
      )
  }
}
