import { useState } from 'react';
import { Alert } from 'react-native';
import { LoginLandingScreen } from '../screens/LoginLandingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { OtpVerificationScreen } from '../screens/OtpVerificationScreen';
import { PhoneLoginScreen } from '../screens/PhoneLoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { authService } from '../services/authService';
import { RouteName, SignUpDraft } from '../types/navigation';

export function AppNavigator() {
  const [route, setRoute] = useState<RouteName>('splash');
  const [phone, setPhone] = useState('');
  const startOtp = async (number: string) => { const response = await authService.requestOtp(number); setPhone(response.phone); setRoute('otp'); };
  const verify = async (code: string) => { const response = await authService.verifyOtp(code); if (response.verified) { Alert.alert('Verified', 'Your mobile number has been verified locally.'); setRoute('home'); } };
  if (route === 'splash') return <SplashScreen onContinue={() => setRoute('landing')} />;
  if (route === 'landing') return <LoginLandingScreen onLogin={() => setRoute('phoneLogin')} onSignUp={() => setRoute('signUp')} />;
  if (route === 'phoneLogin') return <PhoneLoginScreen onBack={() => setRoute('landing')} onContinue={startOtp} />;
  if (route === 'signUp') return <SignUpScreen onBack={() => setRoute('landing')} onSubmit={(draft: SignUpDraft) => startOtp(draft.phone)} />;
  if (route === 'home') return <HomeScreen />;
  return <OtpVerificationScreen phone={phone} onBack={() => setRoute('phoneLogin')} onVerify={verify} />;
}
