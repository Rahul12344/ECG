import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import BluetoothManager from './BluetoothManager.js';

export default function GraphScreen() {
	const [dataArr, setData] = useState(Array(12).fill(0));

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
		    <ScrollView
		      style={styles.container}
		      contentContainerStyle={styles.contentContainer}>
          <BluetoothManager/>
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

		      </ScrollView>
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