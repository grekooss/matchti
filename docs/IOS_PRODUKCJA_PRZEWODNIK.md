# iOS Production Deploy - Przewodnik dla Matchti

Kompletny przewodnik wdrożenia aplikacji Matchti na iOS App Store z działającym Google OAuth.

## 📋 Wymagania wstępne

### 1. Apple Developer Account
- **Apple Developer Program**: $99/rok
- **Rejestracja**: [developer.apple.com](https://developer.apple.com)
- **Weryfikacja**: Może potrwać 24-48h

### 2. Expo/EAS Account
- **Rejestracja**: [expo.dev](https://expo.dev)
- **Plan**: Starter (bezpłatny) lub wyższy

## 🔧 Konfiguracja Apple Developer Portal

### 1. Utwórz App ID
1. Przejdź do [Apple Developer Portal](https://developer.apple.com/account)
2. "Certificates, Identifiers & Profiles" → "Identifiers"
3. Kliknij "+" → "App IDs" → "App"
4. **Description**: Matchti
5. **Bundle ID**: `com.grekoss.matchti` (musi być zgodne z app.json)
6. **Capabilities**:
   - Associated Domains (dla deep linking)
   - Push Notifications (jeśli planujesz)

### 2. Skonfiguruj Associated Domains (dla OAuth callback)
W App ID:
1. Zaznacz "Associated Domains"
2. Zapisz App ID
3. Później dodasz domeny w Xcode/app.json

## 🔑 Google Cloud Console - iOS OAuth Client

### 1. Utwórz iOS OAuth Client ID
1. [Google Cloud Console](https://console.cloud.google.com)
2. "APIs & Services" → "Credentials"
3. "CREATE CREDENTIALS" → "OAuth client ID"
4. **Application type**: iOS
5. **Name**: Matchti iOS Production
6. **Bundle ID**: `com.grekoss.matchti`
7. Skopiuj **Client ID** - będzie potrzebny w Supabase

### 2. Pobierz GoogleService-Info.plist (opcjonalnie)
Jeśli używasz Firebase/Google Services:
1. [Firebase Console](https://console.firebase.google.com)
2. Dodaj aplikację iOS
3. Pobierz GoogleService-Info.plist

## 📱 Konfiguracja projektu Expo

### 1. Zaktualizuj app.json
```json
{
  "expo": {
    "name": "Matchti",
    "slug": "matchti",
    "version": "1.0.0",
    "scheme": "matchti",
    "ios": {
      "bundleIdentifier": "com.grekoss.matchti",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "CFBundleURLTypes": [
          {
            "CFBundleURLName": "matchti-oauth",
            "CFBundleURLSchemes": ["matchti"]
          }
        ],
        "LSApplicationQueriesSchemes": [
          "googlegmail",
          "googleplus"
        ]
      },
      "associatedDomains": [
        "applinks:matchti.app"
      ]
    }
  }
}
```

### 2. Zainstaluj EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 3. Konfiguruj EAS Build
```bash
eas build:configure
```

Utworzy się plik `eas.json`:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🚀 Build Process

### 1. Przygotuj credentials
```bash
# Automatyczna konfiguracja (zalecane)
eas build --platform ios --profile production

# Lub ręczna konfiguracja credentials
eas credentials:configure
```

EAS automatycznie:
- Utworzy Distribution Certificate
- Utworzy Provisioning Profile
- Skonfiguruje Push Notification Certificate (jeśli potrzebny)

### 2. Zbuduj aplikację
```bash
# Development build (do testowania)
eas build --platform ios --profile development

# Production build (do App Store)
eas build --platform ios --profile production
```

### 3. Monitoruj build
- Link do build: Pojawi się w terminalu
- Status: [expo.dev/accounts/[username]/projects/matchti/builds](https://expo.dev)
- Czas budowy: 10-20 minut

## 🔐 Konfiguracja Supabase OAuth

### 1. Dodaj iOS Provider
1. Supabase Dashboard → "Authentication" → "Providers"
2. Znajdź "Google"
3. **Client ID (for iOS)**: Z Google Cloud Console iOS OAuth Client
4. **Client Secret (for iOS)**: Z Google Cloud Console iOS OAuth Client

### 2. Redirect URLs
Dodaj w Supabase Auth settings:
- `matchti://auth/callback`
- `com.grekoss.matchti://auth/callback`

## 📤 Deploy na App Store

### 1. App Store Connect Setup
1. [App Store Connect](https://appstoreconnect.apple.com)
2. "My Apps" → "+" → "New App"
3. **Platform**: iOS
4. **Name**: Matchti
5. **Primary Language**: Polski
6. **Bundle ID**: com.grekoss.matchti
7. **SKU**: matchti-ios-2024

### 2. Wypełnij metadane aplikacji
- **App Information**: Opis, kategoria, słowa kluczowe
- **Pricing**: Bezpłatna
- **App Privacy**: Polityka prywatności URL
- **Screenshots**: iPhone i iPad (różne rozmiary)

### 3. Upload buildu przez EAS
```bash
# Automatyczne przesłanie do App Store Connect
eas submit --platform ios --profile production

# Lub ręczne przesłanie .ipa
eas build --platform ios --profile production
# Następnie upload przez Transporter lub Application Loader
```

### 4. Review Process
1. **Binary**: Upload i weryfikacja
2. **Metadata**: Opis, screenshots, ikonki
3. **Submit for Review**: Może potrwać 1-7 dni
4. **Release**: Automatycznie po aprobacie

## 🧪 Testowanie przed wydaniem

### 1. TestFlight (Beta Testing)
```bash
# Build z automatycznym upload do TestFlight
eas build --platform ios --profile production --auto-submit
```

1. App Store Connect → TestFlight
2. Dodaj beta testerów (email)
3. Przetestuj OAuth flow na prawdziwych urządzeniach

### 2. Manual Testing Checklist
- [ ] Logowanie Google działa
- [ ] Deep linking z OAuth callback
- [ ] Wszystkie funkcjonalności działają
- [ ] Aplikacja nie crashuje
- [ ] UI/UX zgodne z wytycznymi

## 🔍 Troubleshooting iOS

### OAuth nie działa
```bash
# Sprawdź URL scheme
cat app.json | grep -A5 "scheme"

# Sprawdź bundle identifier
cat app.json | grep "bundleIdentifier"
```

**Najczęstsze problemy:**
- Bundle ID niezgodny między app.json, Apple Developer Portal i Google Cloud Console
- Brak CFBundleURLSchemes w Info.plist
- Niepoprawny redirect URL w Supabase

### Build fails
**Certyfikaty:**
```bash
# Reset certificates
eas credentials:delete

# Ponowne utworzenie
eas build --platform ios --clear-cache
```

**Provisioning Profile:**
- Sprawdź czy App ID ma włączone odpowiednie capabilities
- Zweryfikuj Bundle ID we wszystkich miejscach

### App Store Rejection
**Najczęstsze powody:**
- Brak polityki prywatności
- Niepoprawne screenshots
- Funkcjonalność niezgodna z App Store Guidelines
- Crash podczas review

## 📋 Checklist iOS Production

### Pre-Build
- [ ] Apple Developer Account aktywny ($99/rok)
- [ ] Bundle ID skonfigurowany w Apple Developer Portal
- [ ] Google OAuth Client ID utworzony dla iOS
- [ ] app.json zaktualizowany z iOS konfiguracją
- [ ] EAS CLI zainstalowany i skonfigurowany

### Build & Deploy
- [ ] `eas build --platform ios --profile production`
- [ ] Build zakończony pomyślnie
- [ ] .ipa plik wygenerowany
- [ ] TestFlight testing zakończony
- [ ] App Store Connect metadata wypełniona

### Post-Deploy
- [ ] OAuth flow przetestowany na production build
- [ ] Wszystkie funkcjonalności działają
- [ ] App Store review przeszedł pomyślnie
- [ ] Aplikacja dostępna w App Store

## 💡 Wskazówki

1. **Pierwszy deploy**: Może potrwać dłużej z powodu konfiguracji certificates
2. **Bundle ID**: Nie można zmienić po publikacji w App Store
3. **Version/Build Number**: Musi być unikatowy dla każdego upload
4. **TestFlight**: Wykorzystuj do testowania przed production release
5. **Review**: Apple Review może potrwać 1-7 dni

## 🆘 Pomoc

**Problemy z build:**
- [Expo Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Build Troubleshooting](https://docs.expo.dev/build/troubleshooting/)

**Problemy z App Store:**
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

**OAuth Issues:**
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)