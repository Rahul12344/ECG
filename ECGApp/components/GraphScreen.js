import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BleManager } from 'react-native-ble-plx';
import BluetoothList from './BluetoothList';

export default function GraphScreen() {
	const [dataArr, setData] = useState(Array(12).fill(0));
  const [bleManager, setBleManager] = useState(new BleManager());
  //const [bleDevicesArr, setBleDevices] = useState(Array());

  useEffect(() => {
    // Scan for bluetooth on component mount
    //const bleManage = new BleManager();

    //setBleManager(bleManage);
    //console.log("bluetooth mounted");
    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => {
      bleManager.stopDeviceScan();
    }
  }, []);

  const serviceUUID = (num) => {
    return "0000FFE0-0000-1000-8000-00805F9B34FB";
  }
  
  const notifyUUID = (num) => {
    return "0000FFE1-0000-1000-8000-00805F9B34FB";
  }

  const setupNotifications = async (product) => {
    //for (const id in this.sensors) {
    // what are service ID and characteristic ID?
      const service = serviceUUID(id);
      const characteristicN = notifyUUID(id);

      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if (error) {
          console.log(error.message);
          return
        }
        //add characteristic.value value to graphs
        //this.updateValue(characteristic.uuid, characteristic.value)
        updateData(characteristic.value);
      })
    //}
  }

  const scanAndConnect = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }
      console.log("Scanning...");

      console.log(device.name);    // is printing out bluetooth devices!
      console.log(device.id);

      // Checks for null
      if (!device || !device.name) return;

      // Name of bluetooth = DCG TECH
      if (device.name.localeCompare("Amy’s MacBook Air") == 0) {
        console.log("Found device!");
        bleManager.stopDeviceScan();

        device.connect()
          .then((device) => {
            console.log("Discovering services and characteristics...");
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            // Do work on device with services and characteristics
            console.log("Setting notifications");
            return setupNotifications(device)
          })
          .then(() => {
            console.log("Listening...");
          }, (error) => {
            // Handle errors
            console.log("Error connecting to bluetooth device.");
          });
      }
      
     });
  }

  const updateData = (data) => {
    setData( dataArr => [
      data, 
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
	          onPress={() => updateData(Math.random() * 50)}
	        />
	        <Button
	          title="Reset"
	          onPress={clearData}
	        />

          
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