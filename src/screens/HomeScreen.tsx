import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/ui';
import { colors } from '../theme/theme';

export function HomeScreen() {
  return <Screen><View style={styles.topBar}><View><Text style={styles.greeting}>Jai Jinendra</Text><Text style={styles.subtitle}>Welcome to JainSarthi</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Open menu" style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}><View style={styles.menuLine} /><View style={styles.menuLine} /><View style={styles.menuLine} /></Pressable></View></Screen>;
}

const styles = StyleSheet.create({
  topBar: { height: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1D7BF' },
  greeting: { color: colors.maroon, fontFamily: 'serif', fontSize: 25, fontWeight: '600' },
  subtitle: { color: colors.muted, fontSize: 11, marginTop: 2 },
  menuButton: { width: 43, height: 43, borderRadius: 12, backgroundColor: colors.surfaceLow, alignItems: 'center', justifyContent: 'center', gap: 4 },
  menuLine: { width: 19, height: 2, borderRadius: 2, backgroundColor: colors.maroon },
  pressed: { opacity: .75 },
});
