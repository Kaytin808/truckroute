import React, {useMemo, useState} from 'react';
import {
  Alert,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {newTruckProfile} from '../../data/repositories/TruckProfileRepository';
import {colors} from '../../theme/colors';
import {
  feetAndInchesToInches,
  inchesToFeetAndInches,
  type HazmatClass,
  type TruckProfile,
} from '../../types/truck';
import {useTruckProfiles} from './TruckProfilesContext';

const hazmatOptions: HazmatClass[] = [
  'none',
  'explosives',
  'gas',
  'flammable',
  'oxidizer',
  'poison',
  'radioactive',
  'corrosive',
  'other',
];

interface NumberFieldProps {
  label: string;
  value: number;
  onChange(value: number): void;
  suffix?: string;
  keyboardType?: KeyboardTypeOptions;
}

function NumberField({label, value, onChange, suffix, keyboardType}: NumberFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel={label}
          keyboardType={keyboardType ?? 'number-pad'}
          onChangeText={text => onChange(Number(text.replace(/[^0-9.]/g, '')) || 0)}
          selectTextOnFocus
          style={styles.input}
          value={String(value)}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

export function ProfilesScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {profiles, loading, error, save, activate, remove} = useTruckProfiles();
  const [draft, setDraft] = useState<TruckProfile>();
  const [saving, setSaving] = useState(false);
  const height = useMemo(
    () => ({
      feet: Math.floor((draft?.heightInches ?? 0) / 12),
      inches: (draft?.heightInches ?? 0) % 12,
    }),
    [draft?.heightInches],
  );

  const update = <K extends keyof TruckProfile>(key: K, value: TruckProfile[K]) => {
    setDraft(current => (current ? {...current, [key]: value} : current));
  };

  const saveDraft = async () => {
    if (!draft || !draft.name.trim()) {
      Alert.alert('Profile name required');
      return;
    }
    setSaving(true);
    try {
      await save({...draft, name: draft.name.trim()});
      setDraft(undefined);
    } catch (caught) {
      Alert.alert('Could not save profile', caught instanceof Error ? caught.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + 28}]}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Truck profiles</Text>
      <Text style={styles.subtitle}>
        The active profile is sent to the selected truck-routing provider and used for local restriction warnings.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <Text style={styles.muted}>Loading local profiles…</Text> : null}

      {profiles.map(profile => (
        <View key={profile.id} style={[styles.card, profile.isActive && styles.cardActive]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDraft({...profile})}
            style={styles.cardMain}>
            <Text style={styles.cardTitle}>{profile.name}</Text>
            <Text style={styles.cardDetail}>
              {inchesToFeetAndInches(profile.heightInches)} · {profile.grossWeightLb.toLocaleString()} lb · {profile.axleCount} axles
            </Text>
            <Text style={styles.cardDetail}>
              {Math.round(profile.trailerLengthInches / 12)} ft trailer · Hazmat: {profile.hazmatClass}
            </Text>
          </Pressable>
          {profile.isActive ? (
            <Text style={styles.activePill}>ACTIVE</Text>
          ) : (
            <View style={styles.cardActions}>
              <Pressable style={styles.smallButton} onPress={() => activate(profile.id)}>
                <Text style={styles.smallButtonText}>Use</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => remove(profile.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}

      <Pressable
        accessibilityRole="button"
        style={styles.addButton}
        onPress={() => setDraft(newTruckProfile())}>
        <Text style={styles.addButtonText}>+ Add profile</Text>
      </Pressable>

      {draft ? (
        <View style={styles.editor}>
          <Text style={styles.editorTitle}>Edit profile</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            accessibilityLabel="Profile name"
            onChangeText={text => update('name', text)}
            style={[styles.input, styles.nameInput]}
            value={draft.name}
          />
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <NumberField
                label="Height feet"
                value={height.feet}
                onChange={feet => update('heightInches', feetAndInchesToInches(feet, height.inches))}
                suffix="ft"
              />
            </View>
            <View style={styles.column}>
              <NumberField
                label="Height inches"
                value={height.inches}
                onChange={inches => update('heightInches', feetAndInchesToInches(height.feet, Math.min(11, inches)))}
                suffix="in"
              />
            </View>
          </View>
          <NumberField label="Gross weight" value={draft.grossWeightLb} onChange={value => update('grossWeightLb', value)} suffix="lb" />
          <NumberField label="Tractor length" value={Math.round(draft.tractorLengthInches / 12)} onChange={value => update('tractorLengthInches', value * 12)} suffix="ft" />
          <NumberField label="Trailer length" value={Math.round(draft.trailerLengthInches / 12)} onChange={value => update('trailerLengthInches', value * 12)} suffix="ft" />
          <NumberField label="Width" value={draft.widthInches} onChange={value => update('widthInches', value)} suffix="in" />
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <NumberField label="Axles" value={draft.axleCount} onChange={value => update('axleCount', value)} />
            </View>
            <View style={styles.column}>
              <NumberField label="Trailers" value={draft.trailerCount} onChange={value => update('trailerCount', value)} />
            </View>
          </View>
          <NumberField label="Clearance safety buffer" value={draft.safetyBufferInches} onChange={value => update('safetyBufferInches', value)} suffix="in" />
          <Text style={styles.label}>Hazmat class</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {hazmatOptions.map(option => (
              <Pressable
                key={option}
                onPress={() => update('hazmatClass', option)}
                style={[styles.chip, draft.hazmatClass === option && styles.chipSelected]}>
                <Text style={[styles.chipText, draft.hazmatClass === option && styles.chipTextSelected]}>{option}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.editorActions}>
            <Pressable style={styles.cancelButton} onPress={() => setDraft(undefined)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} disabled={saving} onPress={saveDraft}>
              <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save profile'}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Safety notice</Text>
        <Text style={styles.disclaimerText}>
          Never rely on this app as the only source of clearance or weight information. Data can be missing, wrong, or stale. Obey signs and road authorities.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {padding: 16, backgroundColor: colors.paper},
  title: {fontSize: 30, color: colors.ink, fontWeight: '900'},
  subtitle: {fontSize: 16, lineHeight: 23, color: colors.slate, marginTop: 6, marginBottom: 18},
  error: {color: colors.danger, fontWeight: '700', marginBottom: 12},
  muted: {color: colors.slate, marginVertical: 12},
  card: {minHeight: 112, flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: colors.fog, backgroundColor: colors.white, marginBottom: 12, padding: 14},
  cardActive: {borderColor: colors.amber},
  cardMain: {flex: 1, minHeight: 76, justifyContent: 'center'},
  cardTitle: {fontSize: 19, fontWeight: '900', color: colors.ink},
  cardDetail: {fontSize: 14, color: colors.slate, marginTop: 5},
  activePill: {color: colors.ink, backgroundColor: colors.amber, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, fontSize: 11, fontWeight: '900'},
  cardActions: {gap: 8},
  smallButton: {minWidth: 60, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: colors.navy},
  smallButtonText: {color: colors.white, fontWeight: '800'},
  deleteButton: {minWidth: 60, minHeight: 44, alignItems: 'center', justifyContent: 'center'},
  deleteText: {color: colors.danger, fontWeight: '800'},
  addButton: {minHeight: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.navy, borderRadius: 12, marginBottom: 20},
  addButtonText: {color: colors.navy, fontSize: 17, fontWeight: '900'},
  editor: {borderRadius: 16, backgroundColor: colors.white, padding: 16, marginBottom: 20},
  editorTitle: {fontSize: 23, fontWeight: '900', color: colors.ink, marginBottom: 16},
  field: {marginBottom: 14},
  label: {fontSize: 13, color: colors.slate, fontWeight: '800', marginBottom: 7},
  inputRow: {flexDirection: 'row', alignItems: 'center'},
  input: {flex: 1, minHeight: 50, borderWidth: 1, borderColor: '#BCC6CF', borderRadius: 10, paddingHorizontal: 13, backgroundColor: colors.paper, color: colors.ink, fontSize: 17, fontWeight: '700'},
  nameInput: {marginBottom: 14},
  suffix: {width: 36, color: colors.slate, fontWeight: '800', textAlign: 'center'},
  twoColumns: {flexDirection: 'row', gap: 12},
  column: {flex: 1},
  chips: {marginBottom: 18},
  chip: {minHeight: 44, justifyContent: 'center', borderRadius: 22, paddingHorizontal: 15, marginRight: 8, borderWidth: 1, borderColor: colors.slate},
  chipSelected: {backgroundColor: colors.navy, borderColor: colors.navy},
  chipText: {color: colors.ink, fontWeight: '700', textTransform: 'capitalize'},
  chipTextSelected: {color: colors.white},
  editorActions: {flexDirection: 'row', gap: 10},
  cancelButton: {flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: colors.fog},
  cancelText: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  saveButton: {flex: 2, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: colors.amber},
  saveText: {color: colors.ink, fontSize: 16, fontWeight: '900'},
  disclaimer: {borderLeftWidth: 5, borderLeftColor: colors.danger, backgroundColor: '#FFF0EE', padding: 14, borderRadius: 8},
  disclaimerTitle: {fontSize: 16, color: colors.danger, fontWeight: '900'},
  disclaimerText: {fontSize: 14, lineHeight: 20, color: colors.ink, marginTop: 5},
});
