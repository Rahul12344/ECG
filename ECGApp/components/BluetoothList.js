import React from 'react';
import { Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default class BluetoothList extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	bleManager: new BleManager(),
	    };
	}

	/* TODO: What are the service UUIDs? */
	serviceUUID(num) {
		return "";
	}

	notifyUUID(num) {
		return "";
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

    componentWillUnmount() {
        this.state.bleManager.stopDeviceScan();
	}
	
	async setupNotifications(device) {
		for (const id in this.sensors) {
			const service = this.serviceUUID(id)
			const characteristicN = this.notifyUUID(id)

			device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
				if (error) {
					this.error(error.message)
					return
				}
				//add characteristic.value value to graphs
				//this.updateValue(characteristic.uuid, characteristic.value)
			})
		}
	  }

    scan() {
	    this.state.bleManager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				// Handle error (scanning will be stopped automatically)
				return
			}
			console.log("Scanning...");

			console.log(device.name);    // is printing out bluetooth devices!

			// Name of bluetooth
			//DCG TECH
			if (device.name.localeCompare("DCG TECH") == 0) {
				this.state.bleManager.stopDeviceScan();

				device.connect()
					.then((device) => {
						console.log("Discovering services and characteristics...");
						return device.discoverAllServicesAndCharacteristics()
					})
					.then((device) => {
						// Do work on device with services and characteristics
						console.log("Setting notifications");
						return this.setupNotifications(device)
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

	render() {
		return(
			<View>
				<Text>Bluetooth List</Text>
			</View>
		);
	}

}