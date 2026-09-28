import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/app/AppNavigator';
import {TruckProfilesProvider} from './src/features/profiles/TruckProfilesContext';
import {colors} from './src/theme/colors';

export default function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';
  const navigationTheme = isDark
    ? {...DarkTheme, colors: {...DarkTheme.colors, primary: colors.amber}}
    : {...DefaultTheme, colors: {...DefaultTheme.colors, primary: colors.navy}};

  return (
    <SafeAreaProvider>
      <TruckProfilesProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
          />
          <AppNavigator />
        </NavigationContainer>
      </TruckProfilesProvider>
    </SafeAreaProvider>
  );
}
