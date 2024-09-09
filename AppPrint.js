import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, PermissionsAndroid, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { BluetoothManager, BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

export default function App() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    checkAndRequestPermissions();
    checkBluetoothEnabled();
  }, []);

  const checkAndRequestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const allPermissionsGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allPermissionsGranted) {
          Alert.alert('Permissões necessárias não concedidas.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const checkBluetoothEnabled = async () => {
    try {
      const enabled = await BluetoothManager.isBluetoothEnabled();
      setIsEnabled(enabled);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const toggleBluetooth = async () => {
    try {
      if (isEnabled) {
        await BluetoothManager.disableBluetooth();
        setIsEnabled(false);
      } else {
        await BluetoothManager.enableBluetooth();
        setIsEnabled(true);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const scanDevices = async () => {
    setLoading(true);
    try {
      const result = await BluetoothManager.scanDevices();
      const parsedResult = JSON.parse(result);
      const pairedDevices = parsedResult.paired || [];
      const foundDevices = parsedResult.found || [];
      const allDevices = [...pairedDevices, ...foundDevices];
      const printerDevices = allDevices.filter(device => device.name && device.name.toUpperCase().includes('MTP'));
      setDevices(printerDevices);
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const connectToDevice = async (address) => {
    try {
      await BluetoothManager.connect(address);
      setConnectedDevice(address);
      Alert.alert('Success', 'Connected to device');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const printTestPage = async () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'No device connected');
      return;
    }
  
    try {
      const textToPrint = "Pastel x 2\nHamburguer x 3 \x1B\x64\x06";
      await BluetoothEscposPrinter.setBlob(3);
      await BluetoothEscposPrinter.printText(textToPrint, {});
      Alert.alert('Success', 'Printed test page');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bluetooth Status: {isEnabled ? "Enabled" : "Disabled"}</Text>
      <Button title={`${isEnabled ? "Disable" : "Enable"} Bluetooth`} onPress={toggleBluetooth} />
      <Button title="Scan Devices" onPress={scanDevices} disabled={loading || !isEnabled} />

      {loading && <Text>Loading...</Text>}

      <FlatList
        data={devices}
        keyExtractor={item => item.address}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={() => connectToDevice(item.address)}>
            <Text>{item.name || 'Unknown Device'}</Text>
            <Text>{item.address}</Text>
          </TouchableOpacity>
        )}
      />

      {connectedDevice && <Button title="Print Test Page" onPress={printTestPage} />}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  device: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  }
});
