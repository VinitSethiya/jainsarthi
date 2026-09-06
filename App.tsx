import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function App() {
  return <SafeAreaView style={styles.app}><StatusBar style="dark" /><AppNavigator /></SafeAreaView>;
}

const styles = StyleSheet.create({ app: { flex: 1 } });
