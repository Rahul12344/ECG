import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BleManager } from 'react-native-ble-plx';
import BluetoothList from './BluetoothList';

export default function GraphScreen() {
	const [dataArr, setData] = useState(Array(12).fill(0));

  //const [bleManager, setBleManager] = useState(new BleManager());
  //const [bleDevicesArr, setBleDevices] = useState(Array());
/*
  useEffect(() => {
    // Scan for bluetooth on component mount
    //const bleManage = new BleManager();

    //setBleManager(bleManage);
    console.log("bluetooth mounted");
    const subscription = this.bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);
  }, []);

  const addData = () => {
    this.props.childFunc();
  }

  const scanAndConnect = () => {
    this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      let prevBleDevices = this.bleDevicesArr.slice();
      prevBleDevices.push(device);
      setBleDevices(prevBleDevices);
      console.log(device.name);

      
      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'TI BLE Sensor Tag' || 
          device.name === 'SensorTag') {
          
          // Stop scanning as it's not necessary if you are scanning for one device.
          this.manager.stopDeviceScan();

          // Proceed with connection.
      }
      
      
    });
  }
*/
  const updateData = () => {
    setData( dataArr => [
      Math.random() * 50, 
      ...dataArr.slice(0, -1)
    ]);
  };

  const clearData = () => {
    setData( dataArr => [...Array(12).fill(0)]);
  };

  const screenWidth = Dimensions.get('window').width
  const data = {
    datasets: [{
      data: dataArr,
      //color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` // optional
    }]
  }

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2 // optional, default 3
  }

		return (

			<View style={styles.container}>
		    
		      <View style={styles.getStartedContainer}>
	          <Text style={styles.getStartedText}>
	            Graph
	          </Text>
	        </View>
	        <LineChart
	          data={data}
	          width={screenWidth}
	          height={220}
	          chartConfig={chartConfig}
	          withShadow={false}
	          withDots={false}
	          withInnerLines={false}
	        />

	        <Button
	          title="New Data"
	          onPress={updateData}
	        />
	        <Button
	          title="Reset"
	          onPress={clearData}
	        />

          <BluetoothList/>
		    </View>
		);
}


GraphScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    paddingTop: 50,
    paddingBottom: 10,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
});