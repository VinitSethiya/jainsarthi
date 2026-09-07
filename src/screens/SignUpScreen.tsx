import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BackButton, CameraIcon, Field, PrimaryButton, RadioOption, Screen } from '../components/ui';
import { CalendarPickerModal } from '../components/CalendarPickerModal';
import { SanghPickerModal } from '../components/SanghPickerModal';
import { colors } from '../theme/theme';
import { LanguagePreference, SignUpDraft } from '../types/navigation';

const phoneFormat = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
};

export function SignUpScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (draft: SignUpDraft) => void;
}) {
  const [draft, setDraft] = useState<SignUpDraft>({
    fullName: '',
    dateOfBirth: '',
    sangh: 'Shree Shankheshwar Parshwanath Sangh, Ahmedabad',
    phone: '',
    languagePreference: 'hindi',
    profilePhotoUri: null,
  });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguagePreference>('hindi');
  const [accepted, setAccepted] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSanghPicker, setShowSanghPicker] = useState(false);

  const set = (key: keyof SignUpDraft, value: string) =>
    setDraft((old) => ({ ...old, [key]: value }));

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photo Permission Needed',
          'Please allow photo library access to choose your profile photo.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Unable to pick photo. Please try again.');
    }
  };

  const submit = () => {
    if (!draft.fullName.trim()) {
      return Alert.alert('Enter Name', 'Please enter your full name.');
    }
    if (!draft.phone.trim()) {
      return Alert.alert('Enter Mobile Number', 'Please enter your 10-digit mobile number.');
    }

    onSubmit({
      ...draft,
      phone: draft.phone.replace(/\s/g, ''),
      profilePhotoUri: photoUri,
      languagePreference: language,
    });
  };

  return (
    <Screen scroll>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>✦  SANGH REGISTRATION</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.copy}>Join your spiritual community and stay connected with your local Sangh.</Text>
      </View>

      {/* Profile Photo Field */}
      <View style={styles.photoFieldContainer}>
        <Pressable
          onPress={pickImage}
          accessibilityRole="button"
          accessibilityLabel="Add profile photo"
          style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarPressed]}
        >
          <View style={styles.avatarCircle}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <CameraIcon color={colors.maroon} size={28} />
                <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
              </View>
            )}
          </View>
          <View style={styles.cameraBadge}>
            <CameraIcon color={colors.white} size={13} />
          </View>
        </Pressable>

        <View style={styles.photoLabelRow}>
          <Text style={styles.photoLabel}>Profile Photo</Text>
          <Text style={styles.photoOptional}>(Optional)</Text>
        </View>

        {photoUri ? (
          <Pressable onPress={() => setPhotoUri(null)} style={styles.removePhotoButton}>
            <Text style={styles.removePhotoText}>Remove photo</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Field 1: Full Name */}
      <Field
        label="Full Name"
        value={draft.fullName}
        onChangeText={(value) => set('fullName', value)}
        placeholder="e.g., Jinendra Kumar Shah"
        autoCapitalize="words"
      />

      {/* Field 2: Date of Birth (Opens In-App Calendar Modal) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Date of Birth</Text>
        <Pressable
          onPress={() => setShowCalendar(true)}
          style={({ pressed }) => [styles.pickerField, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Select Date of Birth"
        >
          <View style={styles.pickerLeft}>
            <Text style={styles.pickerIcon}>📅</Text>
            <Text style={[styles.pickerValue, !draft.dateOfBirth && styles.pickerPlaceholder]}>
              {draft.dateOfBirth ? draft.dateOfBirth : 'DD / MM / YYYY'}
            </Text>
          </View>
          <View style={styles.pickerBadge}>
            <Text style={styles.pickerBadgeText}>Pick Date ▾</Text>
          </View>
        </Pressable>
      </View>

      {/* Field 3: Select Sangh (Opens Sangh Directory Picker) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Select Sangh</Text>
        <Pressable
          onPress={() => setShowSanghPicker(true)}
          style={({ pressed }) => [styles.pickerField, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Select Sangh"
        >
          <View style={styles.pickerLeft}>
            <View style={styles.sanghBadge}>
              <Text style={styles.sanghBadgeText}>🏛️</Text>
            </View>
            <View style={styles.sanghInfo}>
              <Text style={styles.sanghTitle}>{draft.sangh}</Text>
              <Text style={styles.sanghSub}>Tap to change Sangh</Text>
            </View>
          </View>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
      </View>

      {/* Field 4: Mobile Number */}
      <Field
        label="Mobile Number (+91)"
        value={draft.phone}
        onChangeText={(value) => set('phone', phoneFormat(value))}
        placeholder="98765 43210"
        keyboardType="phone-pad"
        maxLength={11}
      />

      {/* Field 5: Language Preference (2 Radio Buttons: Hindi / English) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Language preference</Text>
        <View style={styles.radioRow}>
          <RadioOption
            label="Hindi"
            sublabel="हिंदी"
            selected={language === 'hindi'}
            onPress={() => setLanguage('hindi')}
          />
          <RadioOption
            label="English"
            sublabel="English"
            selected={language === 'english'}
            onPress={() => setLanguage('english')}
          />
        </View>
      </View>

      {/* Terms & Charter */}
      <Pressable style={styles.terms} onPress={() => setAccepted(!accepted)}>
        <View style={[styles.checkbox, accepted && styles.checked]}><Text style={styles.check}>{accepted ? '✓' : ''}</Text></View>
        <Text style={styles.termsText}>I agree to the Terms & Conditions and Sangh Community Charter.</Text>
      </Pressable>

      <PrimaryButton label="Submit" onPress={submit} />

      <View style={styles.member}>
        <Text style={styles.memberText}>Already a member? </Text>
        <Pressable onPress={onBack}><Text style={styles.signIn}>Sign In</Text></Pressable>
      </View>

      {/* Modals */}
      <CalendarPickerModal
        visible={showCalendar}
        currentValue={draft.dateOfBirth}
        onClose={() => setShowCalendar(false)}
        onSelectDate={(val) => set('dateOfBirth', val)}
      />

      <SanghPickerModal
        visible={showSanghPicker}
        currentValue={draft.sangh}
        onClose={() => setShowSanghPicker(false)}
        onSelectSangh={(val) => set('sangh', val)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 22, marginBottom: 20 },
  eyebrow: { color: colors.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
  title: { color: colors.maroon, fontSize: 28, fontWeight: '600', fontFamily: 'serif' },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  photoFieldContainer: { alignItems: 'center', marginBottom: 20, marginTop: 2 },
  avatarButton: { position: 'relative' },
  avatarPressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.surfaceLow,
    borderWidth: 2,
    borderColor: '#E8D5C4',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 46 },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  avatarPlaceholderText: { color: colors.maroon, fontSize: 11, fontWeight: '700' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  photoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  photoLabel: { color: colors.ink, fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  photoOptional: { color: colors.muted, fontSize: 11 },
  removePhotoButton: { marginTop: 4, paddingVertical: 2, paddingHorizontal: 8 },
  removePhotoText: { color: colors.maroon, fontSize: 11, fontWeight: '600' },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { color: colors.ink, fontSize: 12, fontWeight: '700', letterSpacing: 0.4, marginBottom: 7 },
  pickerField: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: colors.ink,
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  pickerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerIcon: {
    fontSize: 18,
  },
  pickerValue: {
    fontSize: 15,
    color: colors.ink,
    fontWeight: '500',
  },
  pickerPlaceholder: {
    color: '#897172',
  },
  pickerBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.surfaceLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  pickerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.maroon,
  },
  chevron: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: '700',
  },
  sanghBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sanghBadgeText: { fontSize: 16 },
  sanghInfo: { flex: 1 },
  sanghTitle: { color: colors.ink, fontSize: 13.5, fontWeight: '600' },
  sanghSub: { color: colors.muted, fontSize: 11, marginTop: 1 },
  radioRow: { flexDirection: 'row', gap: 12 },
  terms: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 22 },
  checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8D5C4' },
  checked: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  check: { color: colors.white, fontWeight: '800' },
  termsText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
  member: { flexDirection: 'row', justifyContent: 'center', marginTop: 17, marginBottom: 18 },
  memberText: { color: colors.muted, fontSize: 12 },
  signIn: { color: colors.maroon, fontSize: 12, fontWeight: '700' },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});

