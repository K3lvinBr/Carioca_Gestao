import 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';
import AppRoutes from './src/routes';
import theme from './src/styles/theme';
import { useEffect } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';

export default function App() {

  useEffect(() => {
    setOrientation();

    const subscription = Dimensions.addEventListener('change', setOrientation);

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const setOrientation = async () => {
    if (theme.isTablet) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar hidden />
        <AppRoutes />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
