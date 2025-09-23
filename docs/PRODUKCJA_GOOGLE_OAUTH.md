# Konfiguracja Google OAuth dla Produkcji - Matchti

Ten dokument zawiera instrukcje konfiguracji Google OAuth dla aplikacji Matchti w środowisku produkcyjnym.

## 🔧 Konfiguracja Google Cloud Console

### 1. Utwórz projekt Google Cloud (jeśli nie masz)
1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Kliknij "Select a project" i "NEW PROJECT"
3. Nazwa: `matchti-production`
4. Kliknij "CREATE"

### 2. Włącz Google+ API
1. W Google Cloud Console przejdź do "APIs & Services" > "Library"
2. Wyszukaj "Google+ API"
3. Kliknij "Google+ API" i następnie "ENABLE"

### 3. Skonfiguruj OAuth consent screen
1. Przejdź do "APIs & Services" > "OAuth consent screen"
2. Wybierz "External" jako User Type
3. Wypełnij wymagane pola:
   - **App name**: Matchti
   - **User support email**: [twój email]
   - **Developer contact information**: [twój email]
4. Kliknij "SAVE AND CONTINUE"

### 4. Utwórz OAuth 2.0 Client IDs
1. Przejdź do "APIs & Services" > "Credentials"
2. Kliknij "CREATE CREDENTIALS" > "OAuth client ID"

#### Dla Android:
1. **Application type**: Android
2. **Name**: Matchti Android
3. **Package name**: `com.grekoss.matchti` (zgodne z app.json)
4. **SHA-1 certificate fingerprint**:
   - Dla developmentu: Uruchom `expo credentials:manager` i skopiuj SHA-1
   - Dla produkcji: Pobierz SHA-1 z Google Play Console lub EAS Build

#### Dla iOS:
1. **Application type**: iOS
2. **Name**: Matchti iOS
3. **Bundle ID**: `com.grekoss.matchti` (zgodne z app.json)

#### Dla Web (opcjonalne):
1. **Application type**: Web application
2. **Name**: Matchti Web
3. **Authorized redirect URIs**:
   - `https://matchti.app/auth/callback`

## 🔑 Konfiguracja Supabase

### 1. Dodaj providera Google w Supabase
1. Przejdź do swojego projektu Supabase
2. "Authentication" > "Providers"
3. Znajdź "Google" i włącz go
4. Wprowadź dane z Google Cloud Console:
   - **Client ID**: Z Android OAuth client
   - **Client Secret**: Z Android OAuth client

### 2. Skonfiguruj Redirect URLs
W sekcji "Auth" > "URL Configuration" dodaj:
- `matchti://auth/callback`
- `com.grekoss.matchti://auth/callback`
- `https://matchti.app/auth/callback` (jeśli masz webową wersję)

## 📱 Konfiguracja aplikacji

### 1. Zmienne środowiskowe (.env)
Utwórz plik `.env` na podstawie `.env.example`:

```bash
# Supabase Cloud - konfiguracja połączenia
EXPO_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Maps (opcjonalnie)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=twoj_klucz_api_tutaj
```

### 2. Konfiguracja app.json
Upewnij się, że app.json zawiera poprawne dane:

```json
{
  "expo": {
    "name": "matchti",
    "slug": "matchti",
    "scheme": "matchti",
    "ios": {
      "bundleIdentifier": "com.grekoss.matchti"
    },
    "android": {
      "package": "com.grekoss.matchti",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "matchti.app"
            },
            {
              "scheme": "matchti"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## 🚀 Deployment

### 1. EAS Build
```bash
# Zainstaluj EAS CLI (jeśli nie masz)
npm install -g eas-cli

# Login do Expo
eas login

# Skonfiguruj build
eas build:configure

# Zbuduj dla production
eas build --platform all --profile production
```

### 2. Weryfikacja SHA-1 dla Android
Po zbudowaniu aplikacji przez EAS:
1. Pobierz SHA-1 fingerprint z EAS
2. Dodaj go do OAuth client w Google Cloud Console

### 3. Testowanie
1. Zainstaluj build na urządzeniu
2. Przetestuj flow logowania Google
3. Sprawdź logi w Supabase Auth

## 🔍 Troubleshooting

### Problemy z callback
- **Sprawdź scheme**: Musi być identyczny w app.json i Supabase
- **Deep linking**: Upewnij się, że intentFilters są poprawnie skonfigurowane
- **Bundle ID/Package**: Musi być identyczny w app.json i Google Cloud Console

### Problemy z OAuth
- **Client ID**: Upewnij się, że używasz właściwego Client ID (Android/iOS)
- **SHA-1**: Dla Android musi być poprawny SHA-1 fingerprint
- **Consent screen**: Musi być opublikowany (nie w trybie testowym)

### Logi debugowania
Sprawdź logi w:
- Expo DevTools / React Native Debugger
- Supabase Dashboard > Auth > Users
- Google Cloud Console > Logging

## 📋 Checklist wdrożeniowa

- [ ] Projekt Google Cloud utworzony i skonfigurowany
- [ ] Google+ API włączone
- [ ] OAuth consent screen skonfigurowany
- [ ] OAuth client IDs utworzone (Android/iOS)
- [ ] Supabase provider Google skonfigurowany
- [ ] Redirect URLs dodane w Supabase
- [ ] Zmienne środowiskowe zaktualizowane
- [ ] app.json skonfigurowane
- [ ] EAS build profile utworzony
- [ ] SHA-1 fingerprint dodany do Google Cloud Console
- [ ] Aplikacja zbudowana i wdrożona
- [ ] Flow OAuth przetestowany na urządzeniu

## 🆘 Wsparcie

W przypadku problemów:
1. Sprawdź logi w Expo DevTools
2. Zweryfikuj konfigurację w Google Cloud Console
3. Skontaktuj się z dokumentacją Supabase Auth
4. Sprawdź GitHub Issues dla podobnych problemów