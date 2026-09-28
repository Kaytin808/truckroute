import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Camera, Map, UserLocation} from '@maplibre/maplibre-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTruckProfiles} from '../profiles/TruckProfilesContext';
import {useLocationPermission} from '../../services/location/useLocationPermission';
import {inchesToFeetAndInches} from '../../types/truck';
import {colors} from '../../theme/colors';

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const PHOENIX: [number, number] = [-112.074, 33.4484];

export function MapScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';
  const {activeProfile} = useTruckProfiles();
  const location = useLocationPermission();
  const [follow, setFollow] = useState(true);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={OPENFREEMAP_STYLE}
        style={styles.map}
        attribution
        attributionPosition={{bottom: 110 + insets.bottom, left: 8}}
        logo={false}
        compass
        compassPosition={{top: 92 + insets.top, right: 12}}>
        <Camera
          initialViewState={{center: PHOENIX, zoom: 9}}
          trackUserLocation={location.isGranted && follow ? 'course' : undefined}
          zoom={location.isGranted && follow ? 15 : undefined}
        />
        {location.isGranted ? (
          <UserLocation animated accuracy heading minDisplacement={5} />
        ) : null}
      </Map>

      <View style={[styles.warning, {top: insets.top + 8}]}>
        <Text style={styles.warningText} numberOfLines={2}>
          Restriction data may be incomplete or outdated. Posted signs always win.
        </Text>
      </View>

      <View style={[styles.controls, {bottom: 112 + insets.bottom}]}>
        {!location.isGranted ? (
          <Pressable
            accessibilityRole="button"
            onPress={location.ask}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Enable location</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{selected: follow}}
            onPress={() => setFollow(value => !value)}
            style={[styles.roundButton, follow && styles.roundButtonSelected]}>
            <Text style={styles.roundButtonText}>{follow ? '◎' : '⌖'}</Text>
          </Pressable>
        )}
      </View>

      <View
        style={[
          styles.profileCard,
          {bottom: insets.bottom + 8},
          dark && styles.profileCardDark,
        ]}>
        <View>
          <Text style={[styles.eyebrow, dark && styles.textMutedDark]}>
            ACTIVE TRUCK
          </Text>
          <Text style={[styles.profileName, dark && styles.textDark]}>
            {activeProfile?.name ?? 'Loading profile…'}
          </Text>
        </View>
        {activeProfile ? (
          <View style={styles.profileNumbers}>
            <Text style={[styles.profileMetric, dark && styles.textDark]}>
              {inchesToFeetAndInches(activeProfile.heightInches)} high
            </Text>
            <Text style={[styles.profileMetric, dark && styles.textDark]}>
              {activeProfile.grossWeightLb.toLocaleString()} lb
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.attributionBadge} pointerEvents="none">
        <Text style={styles.attributionText}>© OpenStreetMap contributors · OpenFreeMap</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.fog},
  map: {flex: 1},
  warning: {
    position: 'absolute',
    left: 12,
    right: 12,
    minHeight: 56,
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(16, 24, 32, 0.92)',
  },
  warningText: {color: colors.white, fontSize: 15, fontWeight: '700'},
  controls: {position: 'absolute', right: 16, alignItems: 'flex-end'},
  primaryButton: {
    minHeight: 52,
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.navy,
  },
  primaryButtonText: {color: colors.white, fontSize: 16, fontWeight: '800'},
  roundButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  roundButtonSelected: {backgroundColor: colors.amber},
  roundButtonText: {fontSize: 28, color: colors.ink, fontWeight: '900'},
  profileCard: {
    position: 'absolute',
    left: 8,
    right: 8,
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  profileCardDark: {backgroundColor: colors.ink},
  eyebrow: {fontSize: 11, color: colors.slate, fontWeight: '900', letterSpacing: 1},
  profileName: {fontSize: 19, color: colors.ink, fontWeight: '900', marginTop: 4},
  profileNumbers: {alignItems: 'flex-end'},
  profileMetric: {fontSize: 14, color: colors.ink, fontWeight: '700', marginVertical: 2},
  textDark: {color: colors.white},
  textMutedDark: {color: colors.fog},
  attributionBadge: {
    position: 'absolute',
    left: 8,
    bottom: 100,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  attributionText: {fontSize: 9, color: colors.ink},
});
