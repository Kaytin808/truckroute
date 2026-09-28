import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MapScreen} from '../features/map/MapScreen';
import {ProfilesScreen} from '../features/profiles/ProfilesScreen';
import {colors} from '../theme/colors';

export type RootTabs = {
  Map: undefined;
  Truck: undefined;
};

const Tabs = createBottomTabNavigator<RootTabs>();

const tabIcon = (symbol: string, color: string) => (
  <Text style={[styles.icon, {color}]}>{symbol}</Text>
);

export function AppNavigator(): React.JSX.Element {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.slate,
        tabBarLabelStyle: {fontSize: 13, fontWeight: '800'},
        tabBarStyle: {minHeight: 64, paddingTop: 6},
      }}>
      <Tabs.Screen
        name="Map"
        component={MapScreen}
        options={{tabBarIcon: ({color}) => tabIcon('◆', color)}}
      />
      <Tabs.Screen
        name="Truck"
        component={ProfilesScreen}
        options={{tabBarIcon: ({color}) => tabIcon('▰', color)}}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {fontSize: 23, fontWeight: '900'},
});
