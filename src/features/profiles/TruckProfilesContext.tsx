import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  activateTruckProfile,
  ensureDefaultTruckProfile,
  listTruckProfiles,
  removeTruckProfile,
  saveTruckProfile,
} from '../../data/repositories/TruckProfileRepository';
import type {TruckProfile} from '../../types/truck';

interface TruckProfilesValue {
  profiles: TruckProfile[];
  activeProfile?: TruckProfile;
  loading: boolean;
  error?: string;
  reload(): Promise<void>;
  save(profile: TruckProfile): Promise<void>;
  activate(id: string): Promise<void>;
  remove(id: string): Promise<void>;
}

const TruckProfilesContext = createContext<TruckProfilesValue | undefined>(
  undefined,
);

export function TruckProfilesProvider({children}: React.PropsWithChildren) {
  const [profiles, setProfiles] = useState<TruckProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const reload = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setProfiles(await listTruckProfiles());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ensureDefaultTruckProfile()
      .then(setProfiles)
      .catch(caught =>
        setError(
          caught instanceof Error ? caught.message : 'Could not initialize database',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(
    async (profile: TruckProfile) => {
      await saveTruckProfile({...profile, updatedAt: new Date().toISOString()});
      await reload();
    },
    [reload],
  );

  const activate = useCallback(
    async (id: string) => {
      await activateTruckProfile(id);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await removeTruckProfile(id);
      await reload();
    },
    [reload],
  );

  const value = useMemo<TruckProfilesValue>(
    () => ({
      profiles,
      activeProfile: profiles.find(profile => profile.isActive),
      loading,
      error,
      reload,
      save,
      activate,
      remove,
    }),
    [profiles, loading, error, reload, save, activate, remove],
  );

  return (
    <TruckProfilesContext.Provider value={value}>
      {children}
    </TruckProfilesContext.Provider>
  );
}

export function useTruckProfiles(): TruckProfilesValue {
  const value = useContext(TruckProfilesContext);
  if (!value) {
    throw new Error('useTruckProfiles must be used inside TruckProfilesProvider');
  }
  return value;
}
