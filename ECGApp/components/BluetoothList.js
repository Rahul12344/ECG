import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default class BluetoothList extends React.Component {

	constructor(props) {
	    super(props);
	    //this.bleManager = new BleManager();
	    this.state = {
	    	bleManager: new BleManager(),
	    	devicesArr: [],
	    };
	}

	componentDidMount() {
		console.log("bluetooth mounted");
    const subscription = this.state.bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scan();
        subscription.remove();
      }
    }, true);
	}

    scan() {
	    this.state.bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }
        if (device.name === null) return
        let prevArr = this.state.devicesArr.slice();
        prevArr.push(device);

        this.setState({
        	devicesArr: prevArr,
        });

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        /*if (device.name === 'TI BLE Sensor Tag' || 
            device.name === 'SensorTag') {
            
            // Stop scanning as it's not necessary if you are scanning for one device.
            this.manager.stopDeviceScan();

            // Proceed with connection.
        }
        */
	    });
	}

	render() {
		return(
			<View>
				<Text>Bluetooth List</Text>
				<FlatList
	        data={this.state.devicesArr}
	        renderItem={({ device }) => <Text>{ device.name }</Text>}
	        keyExtractor={ device => device.id}
		    />
	    </View>
		);
	}

}