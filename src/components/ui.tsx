import { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/theme';

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  const content = <View style={styles.content}>{children}</View>;
  return <View style={styles.screen}>{scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}</View>;
}

export function BackButton({ onPress }: { onPress: () => void }) { return <Pressable onPress={onPress} style={styles.back}><Text style={styles.backText}>←</Text></Pressable>; }

export function TempleMark({ large = false }: { large?: boolean }) {
  const size = large ? 152 : 78; const unit = large ? 1 : .5;
  return <View style={[styles.mark, { width: size, height: size, borderRadius: size / 2 }]}><View style={[styles.markInner, { width: size - 12, height: size - 12, borderRadius: (size - 12) / 2 }]}><View style={styles.temple}><View style={[styles.spire, { borderLeftWidth: 29 * unit, borderRightWidth: 29 * unit, borderBottomWidth: 53 * unit }]} /><View style={[styles.finial, { width: 11 * unit, height: 11 * unit, borderRadius: 6 * unit }]} /><View style={[styles.roof, { width: 94 * unit, height: 9 * unit }]} /><View style={[styles.base, { width: 108 * unit, height: 34 * unit }]}><View style={[styles.door, { width: 23 * unit, height: 23 * unit, borderTopLeftRadius: 12 * unit, borderTopRightRadius: 12 * unit }]} /></View></View></View></View>;
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) { return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primary, disabled && styles.disabled, pressed && !disabled && styles.pressed]}><Text style={styles.primaryText}>{label}</Text><Text style={styles.arrow}>→</Text></Pressable>; }
export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) { return <Pressable onPress={onPress} style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}><Text style={styles.secondaryText}>{label}</Text></Pressable>; }

export function Field({ label, ...props }: TextInputProps & { label: string }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor="#897172" style={styles.input} {...props} /></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface }, content: { flex: 1, paddingHorizontal: 20, paddingVertical: 16 }, scroll: { flexGrow: 1 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLow }, backText: { color: colors.maroon, fontSize: 25 },
  mark: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, shadowColor: colors.ink, shadowOpacity: .11, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, markInner: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLow, borderColor: '#F1D7BF', borderWidth: 1 }, temple: { alignItems: 'center', justifyContent: 'flex-end' }, spire: { width: 0, height: 0, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.maroon }, finial: { backgroundColor: colors.gold, marginBottom: -2 }, roof: { marginTop: 3, backgroundColor: colors.gold, borderTopLeftRadius: 4, borderTopRightRadius: 4 }, base: { alignItems: 'center', justifyContent: 'flex-end', backgroundColor: colors.maroon, borderTopWidth: 3, borderTopColor: '#C98030', borderRadius: 2 }, door: { backgroundColor: colors.goldLight },
  primary: { minHeight: 53, borderRadius: 14, backgroundColor: colors.maroon, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 18, shadowColor: colors.maroonDark, shadowOpacity: .2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, primaryText: { color: colors.white, fontWeight: '700', letterSpacing: .5, fontSize: 14 }, arrow: { color: colors.white, fontSize: 21 }, secondary: { minHeight: 53, borderRadius: 14, backgroundColor: colors.surfaceLow, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18 }, secondaryText: { color: colors.maroon, fontWeight: '700', letterSpacing: .5, fontSize: 14 }, disabled: { opacity: .42 }, pressed: { opacity: .82, transform: [{ scale: .985 }] },
  field: { marginBottom: 16 }, label: { color: colors.ink, fontSize: 12, fontWeight: '700', letterSpacing: .4, marginBottom: 7 }, input: { height: 52, borderRadius: 12, backgroundColor: colors.white, color: colors.ink, paddingHorizontal: 15, fontSize: 15, shadowColor: colors.ink, shadowOpacity: .04, shadowRadius: 5, elevation: 1 },
});
