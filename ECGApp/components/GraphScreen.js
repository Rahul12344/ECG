import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BleManager } from 'react-native-ble-plx';
import BluetoothList from './BluetoothList';
import AsyncStorage from '@react-native-community/async-storage';

export default function GraphScreen() {
  const [timesArr, setTimes] = useState(Array(100).fill(0));
	const [dataArr, setData] = useState(Array(100).fill(0));
  const [bleManager, setBleManager] = useState(new BleManager());
  //var options = new BleManagerOptions();
  //options.restoreStateIdentifier = "234567890sadfashdfh";
  //const bleManager = new BleManager();
  //let key = CBCentralManagerOptionRestoreIdentifierKey
  /*this.manager = BluetoothManager(queue: queue, options: [
      key: "some.unique.string" as AnyObject
  ])*/
  //const [device, setDevice] = useState(null);
  const [isRunning, setIsRunning] = useState(true);

  const deviceID = "DC2821A5-A907-C62C-C246-0A85CAC59B66";
  //const [bleDevicesArr, setBleDevices] = useState(Array());

  useEffect(() => {
    // Scan for bluetooth on component mount
    //const bleManage = new BleManager();

    //setBleManager(bleManage);
    //console.log("bluetooth mounted");
    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        // first check for connected devices
        /*
        var connected = false;
        var serviceIDs = [serviceUUID()];
        bleManager.connectedDevices(serviceIDs)
          .then((devices) => {
            for (device in devices) {
              console.log("Connected device: " + device.name);
              if (device.name.localeCompare("DSD TECH") == 0) {
                // connect here
                connected = true;

                bleManager.isDeviceConnected(device.id)
                  .then((isConnected) => {
                    if (!isConnected) {
                      connectToDevice(device);
                    }
                  }, (error) => {
                    console.log("Error checking if device is connected.");
                  });
              }
            }
          }, (error) => {
            console.log("Error looking for connected devices.");
          });

        if (!connected) {
          scanAndConnect();
        }*/
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => {
      bleManager.stopDeviceScan();
    }
  }, []);

  const serviceUUID = () => {
    return "0000ffe0-0000-1000-8000-00805f9b34fb";
  }

  const notifyUUID = () => {
    return "0000ffe1-0000-1000-8000-00805f9b34fb";
  }

  const base64ToDecimal = (base64) => {
    var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var decimal = 0;
    for (var i = 0, len = 2; i < len; i++) {
        decimal *= 64;
        decimal += ALPHA.indexOf(base64[i]);
    }

    return decimal/16;
  }

  const setupNotifications = async (device) => {
    //for (const id in this.sensors) {
    // what are service ID and characteristic ID?
      const service = serviceUUID();
      const characteristicN = notifyUUID();

      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if (error) {
          console.log(error.message);
          return
        }
        //add characteristic.value value to graphs
        //this.updateValue(characteristic.uuid, characteristic.value)

        //console.log(typeof characteristic.value);
        //var data = new Uint8Array(characteristic.value);

        //data[0] = characteristic.value;
        //console.log('Data received: [' + data[0] +', ' + data[1] + ', ' + data[2] + ', ' + data[3] + ', ' + data[4]);
        /*if (data[0] === 0xAD) {
          var value = (data[4] << 24) | (data[3] << 16) | (data[2] << 8) | data[1];
          //console.log(value);

          //console.log(base64.decode(characteristic.value));
          //console.log(byteArrayToUInt8(base64ToByteArray(characteristic.value)));

        }*/
        //console.log(characteristic.value);
        var decimal = base64ToDecimal(characteristic.value);
        console.log(decimal);
        //if (!isNaN(base64ToDecimal(characteristic.value)))

        updateData(decimal);
      })
    //}
  }

  const connectToDevice = (device) => {
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
      if (device.name.localeCompare("DSD TECH") == 0) {
        console.log("Found device!");

        //setDevice(device);

        bleManager.stopDeviceScan();

        //connectToDevice(device);
        
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
    if (isRunning) {
      setData( dataArr => [
        data, 
        ...dataArr.slice(0, -1)
      ]);

      setTimes( timesArr => [
        (new Date()).getTime(), 
        ...timesArr.slice(0, -1)
      ]);
    }
  };

  const clearData = () => {
    setData( dataArr => [...Array(100).fill(0)]);
  };

  const screenWidth = Dimensions.get('window').width
  const data = {
    //labels: timesArr,
    datasets: [{
      data: dataArr,
      //color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` // optional
    }]
  }

  const startRunning = () => {
    if (!isRunning) {
      setIsRunning(true);
      clearData();
    }
  }

  const stopAndSave = () => {
    storeData(dataArr);
    //setIsRunning(false);
  }

  const disconnectBLE = () => {
    //if (device != null) {
    bleManager.cancelDeviceConnection(deviceID)
      .then((device) => {
        console.log("Device disconnected");
      }, (error) => {
        // Handle errors
        console.log("Error disconnecting to bluetooth device.");
      });
    scanAndConnect();
    //}
  }

  storeData = async (data) => {
    var date = new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear();
    var time = new Date().getHours() + '/' + new Date().getMinutes() + '/' + new Date().getSeconds();
    var dataKey = date + ' ' + time;
    try {
      await AsyncStorage.setItem(dataKey, data.toString());
    } catch (error){
      //error
    }
  };

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
          <Button
            title="Start"
            onPress={() => startRunning()}
          />
          <Button
            title="Stop and Save"
            onPress={() => stopAndSave()}
          />
          <Button
            title="Disconnect Bluetooth"
            onPress={() => disconnectBLE()}
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