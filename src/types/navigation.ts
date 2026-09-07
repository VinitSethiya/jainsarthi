export type RouteName = 'splash' | 'landing' | 'phoneLogin' | 'signUp' | 'otp' | 'home';

export type LanguagePreference = 'hindi' | 'english';

export type SignUpDraft = {
  fullName: string;
  dateOfBirth: string;
  sangh: string;
  phone: string;
  profilePhotoUri?: string | null;
  languagePreference?: LanguagePreference;
};
