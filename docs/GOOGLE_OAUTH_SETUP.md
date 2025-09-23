# Konfiguracja Google OAuth w Supabase

Ten dokument opisuje kroki potrzebne do skonfigurowania logowania przez Google w aplikacji Matchti.

## 1. Konfiguracja Google Cloud Console

### 1.1 Tworzenie projektu Google Cloud
1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Zanotuj **Project ID**

### 1.2 Włączenie Google+ API
1. W Google Cloud Console przejdź do **APIs & Services** > **Library**
2. Wyszukaj i włącz **Google+ API**
3. Wyszukaj i włącz **People API** (opcjonalnie, dla dodatkowych danych profilu)

### 1.3 Tworzenie OAuth 2.0 Credentials
1. Przejdź do **APIs & Services** > **Credentials**
2. Kliknij **Create Credentials** > **OAuth 2.0 Client IDs**
3. Wybierz typ aplikacji: **Web application**
4. Wypełnij następujące pola:

#### Nazwa
```
Matchti App - Google OAuth
```

#### Authorized JavaScript origins
```
https://twój-projekt.supabase.co
```

#### Authorized redirect URIs
```
https://twój-projekt.supabase.co/auth/v1/callback
```

5. Zapisz **Client ID** i **Client Secret**

## 2. Konfiguracja Supabase

### 2.1 Dashboard Supabase
1. Zaloguj się do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz swój projekt Matchti
3. Przejdź do **Authentication** > **Providers**

### 2.2 Konfiguracja Google Provider
1. Znajdź **Google** w liście providerów
2. Włącz toggle **Enable sign in with Google**
3. Wypełnij pola:

#### Client ID (for OAuth)
```
Wklej Client ID z Google Cloud Console
```

#### Client Secret (for OAuth)
```
Wklej Client Secret z Google Cloud Console
```

#### Redirect URL
```
https://twój-projekt.supabase.co/auth/v1/callback
```

4. Kliknij **Save**

## 3. Konfiguracja aplikacji mobilnej

### 3.1 Expo Development
Dla developmentu z Expo Go, aplikacja będzie używać proxy URLs.

### 3.2 Standalone/Production Build
Dla production buildu, musisz skonfigurować custom URL schemes:

#### Android - app.json
```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "twoja-domena.app"
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

#### iOS - app.json
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.grekoss.matchti",
      "supportsTablet": true
    },
    "scheme": "matchti"
  }
}
```

## 4. Zmienne środowiskowe

Upewnij się, że masz skonfigurowane w `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://twój-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=twój-publiczny-klucz-supabase
```

## 5. Testowanie

### 5.1 Development
1. Uruchom `npm start`
2. Otwórz aplikację na urządzeniu/emulatorze
3. Kliknij "Zaloguj się przez Google"
4. Zostaniesz przekierowany do przeglądarki
5. Po autoryzacji zostaniesz przekierowany z powrotem do aplikacji

### 5.2 Możliwe problemy

#### Błąd: "OAuth client not found"
- Sprawdź czy Client ID jest poprawny
- Upewnij się, że projekt Google Cloud jest aktywny

#### Błąd: "Redirect URI mismatch"
- Sprawdź czy redirect URI w Google Console jest identyczny z tym w Supabase
- Upewnij się, że używasz HTTPS

#### Aplikacja nie otrzymuje callback
- Sprawdź konfigurację URL schemes
- Upewnij się, że OAuth handler jest poprawnie zainicjalizowany

## 6. Security Best Practices

1. **Nigdy nie commituj** Client Secret do repozytorium
2. Używaj różnych OAuth clients dla development i production
3. Regularnie sprawdzaj logi autoryzacji w Supabase Dashboard
4. Ogranicz authorized domains w Google Console do niezbędnych

## 7. Dodatkowe konfiguracje

### 7.1 Customowe domeny
Jeśli używasz custom domain dla Supabase:
1. Zaktualizuj redirect URLs w Google Console
2. Zaktualizuj `EXPO_PUBLIC_SUPABASE_URL` w `.env`

### 7.2 Scopes (opcjonalne)
Domyślnie Supabase żąda podstawowych scopes. Aby żądać dodatkowych:
1. W Supabase Dashboard > Authentication > Providers > Google
2. W polu **Additional Scopes** dodaj:
```
profile email openid https://www.googleapis.com/auth/userinfo.profile
```

## 8. Troubleshooting

### Logi
Sprawdź logi w:
- Supabase Dashboard > Authentication > Logs
- React Native/Expo Console
- Google Cloud Console > Logging

### Częste błędy
1. **CORS errors**: Sprawdź allowed origins w Supabase
2. **Token expired**: Supabase automatycznie refreshuje tokeny
3. **Network errors**: Sprawdź połączenie internetowe na urządzeniu

---

Po ukończeniu konfiguracji, logowanie przez Google powinno działać zarówno w development jak i production builds.