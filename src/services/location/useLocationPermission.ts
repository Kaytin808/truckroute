import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

const permission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

export function useLocationPermission() {
  const [status, setStatus] = useState<PermissionStatus>(RESULTS.UNAVAILABLE);

  const refresh = useCallback(async () => {
    if (!permission) {
      return;
    }
    setStatus(await check(permission));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ask = useCallback(async () => {
    if (!permission) {
      return;
    }
    const nextStatus = await request(permission);
    setStatus(nextStatus);
    if (nextStatus === RESULTS.BLOCKED) {
      await openSettings('application');
    }
  }, []);

  return {
    status,
    isGranted: status === RESULTS.GRANTED || status === RESULTS.LIMITED,
    ask,
    refresh,
  };
}
