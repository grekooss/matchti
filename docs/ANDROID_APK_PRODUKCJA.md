# Android APK Production Build - Matchti

Przewodnik budowania APK dla Androida z działającym Google OAuth.

## 🔧 Konfiguracja zakończona

### 1. EAS Build Profile
W `eas.json` dodano profile dla APK:

- **`production`** - domyślnie APK (zmieniono z AAB)
- **`production-aab`** - jeśli kiedyś potrzebujesz AAB dla Play Store
- **`apk`** - dedykowany profil tylko dla APK

## 🚀 Budowanie APK

### Opcja 1: Profil production (APK)
```bash
# Login do Expo (jeśli nie jesteś zalogowany)
npx eas login

# Build APK production
npx eas build --platform android --profile production
```

### Opcja 2: Dedykowany profil APK
```bash
# Build tylko APK
npx eas build --platform android --profile apk
```

### Opcja 3: Build bez auto-increment
```bash
# Build APK z określoną wersją
npx eas build --platform android --profile apk --non-interactive
```

## 📱 Google OAuth dla APK

### 1. Google Cloud Console - Android OAuth Client
1. [Google Cloud Console](https://console.cloud.google.com)
2. "APIs & Services" → "Credentials"
3. Znajdź istniejący Android OAuth client lub utwórz nowy:
   - **Application type**: Android
   - **Package name**: `com.grekoss.matchti`
   - **SHA-1 certificate fingerprint**: Pobierz z EAS po build

### 2. Pobieranie SHA-1 fingerprint

#### Z EAS Build (po zbudowaniu APK):
```bash
# Lista wszystkich builds
npx eas build:list

# Szczegóły konkretnego build
npx eas build:view [BUILD_ID]
```

#### Z lokalnego keystorea (jeśli masz):
```bash
# Jeśli masz local keystore
keytool -list -v -keystore path/to/keystore.jks -alias your-alias
```

### 3. Supabase konfiguracja
1. Supabase Dashboard → "Authentication" → "Providers"
2. Google provider:
   - **Client ID**: Z Android OAuth client (Google Cloud Console)
   - **Client Secret**: Z Android OAuth client
3. Redirect URLs:
   - `matchti://auth/callback`
   - `com.grekoss.matchti://auth/callback`

## 🔐 Signing Configuration

EAS automatycznie zarządza signing:

### Automatic Signing (zalecane)
```bash
# EAS automatycznie utworzy keystore
npx eas build --platform android --profile apk
```

### Manual Signing (opcjonalne)
```bash
# Skonfiguruj credentials ręcznie
npx eas credentials

# Wybierz Android → production → Keystore
```

## 📦 Po zbudowaniu APK

### 1. Pobieranie APK
Po zakończeniu build:
1. Link do pobrania pojawi się w terminalu
2. Lub w [Expo Dashboard](https://expo.dev) → Builds
3. Pobierz APK na urządzenie Android

### 2. Instalacja APK
```bash
# ADB install (jeśli masz ADB)
adb install matchti.apk

# Lub przez file manager na Android
# 1. Skopiuj APK na urządzenie
# 2. Włącz "Unknown sources" w ustawieniach
# 3. Otwórz APK i zainstaluj
```

### 3. Testowanie OAuth
1. Otwórz aplikację
2. Kliknij "Zaloguj się przez Google"
3. Sprawdź czy callback działa: `matchti://auth/callback`

## 🔍 Troubleshooting

### APK nie instaluje się
```bash
# Sprawdź czy APK jest podpisany
jarsigner -verify -verbose -certs matchti.apk

# Sprawdź szczegóły APK
aapt dump badging matchti.apk
```

### OAuth nie działa w APK
1. **SHA-1 fingerprint**: Musi być dodany w Google Cloud Console
2. **Package name**: Sprawdź czy `com.grekoss.matchti` jest wszędzie identyczny
3. **Redirect URL**: Sprawdź w Supabase czy `matchti://auth/callback` jest dodany

### Build fails
```bash
# Clear cache
npx eas build --platform android --profile apk --clear-cache

# Check credentials
npx eas credentials

# Update EAS CLI
npm install -g @expo/eas-cli@latest
```

## 📋 Komendy do skopiowania

### Basic APK Build
```bash
npx eas login
npx eas build --platform android --profile apk
```

### APK Production Build z logami
```bash
npx eas build --platform android --profile production --verbose
```

### Check build status
```bash
npx eas build:list
npx eas build:view [BUILD_ID]
```

### Download APK directly
```bash
npx eas build:download [BUILD_ID] --output ./builds/
```

## ✅ Checklist

### Pre-Build
- [ ] EAS CLI zainstalowane i zalogowane
- [ ] `eas.json` skonfigurowane dla APK
- [ ] `app.json` z poprawnym package name
- [ ] Google Cloud Console OAuth client gotowy

### Build Process
- [ ] `npx eas build --platform android --profile apk`
- [ ] Build zakończony pomyślnie
- [ ] APK pobrany

### Post-Build
- [ ] SHA-1 fingerprint dodany do Google Cloud Console
- [ ] APK zainstalowany na urządzeniu
- [ ] Google OAuth przetestowany
- [ ] Callback `matchti://auth/callback` działa

## 💡 Wskazówki

1. **APK vs AAB**: APK dla direct install, AAB dla Google Play Store
2. **SHA-1**: Każdy keystore ma inny SHA-1 - zawsze sprawdź po build
3. **Signing**: EAS automatycznie zarządza keystoram dla production
4. **Testing**: Przetestuj OAuth na prawdziwym urządzeniu, nie emulatorze
5. **File size**: APK może być większy niż AAB (zawiera wszystkie architektury)

## 🔗 Przydatne linki

- [EAS Build Android Documentation](https://docs.expo.dev/build/setup/#android)
- [Android APK vs AAB](https://docs.expo.dev/build/building-on-ci/#android-aab-vs-apk)
- [Google OAuth Android Setup](https://developers.google.com/identity/sign-in/android/start)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)