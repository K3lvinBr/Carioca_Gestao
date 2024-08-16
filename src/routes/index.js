import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from '../config/firebase';
import Login from '../screens/Login';
import Stacks from './stacks';
import theme from '../styles/theme';
import Tabs from './tabs';

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const AppNavigator = theme.isTablet ? <Stacks /> : <Tabs />;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? AppNavigator : <Login />}
    </NavigationContainer>
  );
};

export default AppRoutes;
