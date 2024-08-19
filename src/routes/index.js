import React, { useState, useEffect } from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { auth } from '../config/firebase';
import Login from '../screens/Login';
import Stacks from './stacks';
import theme from '../styles/theme';
import Tabs from './tabs';

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const AppNavigator = theme.isTablet ? <Stacks /> : <Tabs />;

  const navigationRef = createNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? AppNavigator : <Login />}
    </NavigationContainer>
  );
};

export default AppRoutes;
