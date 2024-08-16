import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from '../screens/Menu';

const Stack = createStackNavigator();

const Stacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="Menu"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Menu"
        component={Menu}
      />
    </Stack.Navigator> 
  );
};

export default Stacks;

