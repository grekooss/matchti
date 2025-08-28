Pełny Przewodnik po Build w Expo

  1. Metro Development Server (Tryb deweloperski lokalny)

  Podstawowe komendy:

  npm start                    # Uruchomienie serwera deweloperskiego
  npx expo start              # To samo co wyżej
  npx expo start --clear      # Czyści cache Metro
  npx expo start --web        # Uruchamia tylko wersję web
  npx expo start --android    # Otwiera na Androidzie
  npx expo start --ios        # Otwiera na iOS

  Co to robi:

  - Uruchamia Metro bundler
  - Hot reload / Fast refresh
  - Debugowanie w czasie rzeczywistym
  - Nie tworzy fizycznych plików - działa w pamięci

  ---
  2. Expo Export (Statyczne pliki)

  Development Export:

  npx expo export --dev
  npx expo export --dev --output-dir ./dist
  npx expo export --dev --platform web

  Production Export:

  npx expo export
  npx expo export --output-dir ./build
  npx expo export --platform android
  npx expo export --platform ios
  npx expo export --platform web

  Różnice:

  | Development       | Production           |
  |-------------------|----------------------|
  | Kod czytelny      | Minifikowany         |
  | Source maps       | Brak source maps     |
  | Debug info        | Bez debug info       |
  | Większy rozmiar   | Mniejszy rozmiar     |
  | Szybsze budowanie | Wolniejsze budowanie |

  ---
  3. EAS Build (Expo Application Services)

  Inicjalizacja EAS:

  npm install -g eas-cli     # Instalacja CLI
  eas login                  # Logowanie
  eas build:configure        # Tworzy eas.json

  Profile buildów w eas.json:

  {
    "cli": {
      "version": ">= 7.8.0"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal",
        "android": {
          "buildType": "apk",
          "gradleCommand": ":app:assembleDebug"
        },
        "ios": {
          "buildConfiguration": "Debug"
        }
      },
      "preview": {
        "distribution": "internal",
        "channel": "preview",
        "android": {
          "buildType": "apk"
        }
      },
      "production": {
        "channel": "production",
        "android": {
          "buildType": "aab"
        },
        "ios": {
          "buildConfiguration": "Release"
        }
      }
    }
  }

  Komendy EAS Build:

  # Development build (z Dev Client)
  eas build --profile development --platform android
  eas build --profile development --platform ios

  # Preview build (do testowania)
  eas build --profile preview --platform all

  # Production build (do sklepów)
  eas build --profile production --platform all

  # Local build (budowanie na własnej maszynie)
  eas build --local --profile production --platform android

  ---
  4. Typy buildów EAS

  Development Build:

  - Zawiera Expo Dev Client
  - Można ładować różne wersje JS bundle
  - Idealne do developmentu w zespole
  - Nie wymaga przebudowywania dla zmian JS

  Preview Build:

  - Standalone aplikacja
  - Do testowania przez testerów/stakeholderów
  - Nie wymaga Expo Go
  - Można dystrybuować przez TestFlight/Firebase App Distribution

  Production Build:

  - Zoptymalizowane do publikacji
  - Android: AAB (Android App Bundle)
  - iOS: IPA gotowe do App Store

  ---
  5. Web Build

  Export do hostingu:

  npx expo export --platform web
  npx expo export --platform web --output-dir ./web-build

  Hosting:

  # Netlify
  npx netlify deploy --dir web-build --prod

  # Vercel  
  npx vercel --prod web-build

  # GitHub Pages
  npm install -g gh-pages
  npx gh-pages -d web-build

  ---
  6. Konfiguracja dla Twojego Projektu

  Dodaj do package.json:

  {
    "scripts": {
      "start": "expo start",
      "android": "expo run:android",
      "ios": "expo run:ios",
      "web": "expo start --web",
      "test": "jest --watchAll",

      // Nowe skrypty build
      "export:dev": "expo export --dev --output-dir ./dist-dev",
      "export:prod": "expo export --output-dir ./dist",
      "export:web": "expo export --platform web --output-dir ./web-build",

      // EAS builds
      "build:dev": "eas build --profile development --platform all",
      "build:preview": "eas build --profile preview --platform all",
      "build:prod": "eas build --profile production --platform all",
      "build:android": "eas build --profile production --platform android",
      "build:ios": "eas build --profile production --platform ios"
    }
  }

  ---
  7. Workflow Deweloperski

  Faza Development:

  npm start                    # Lokalne testy
  npm run export:dev          # Export do testów
  npm run build:dev           # Development build dla zespołu

  Faza Testing:

  npm run build:preview       # Preview build dla testerów

  Faza Production:

  npm run export:prod         # Production export
  npm run build:prod          # Production build do sklepów

  ---
  8. Optymalizacja i Debugging

  Analiza bundle:

  npx expo export --dump-assetmap
  npx @expo/bundle-analyzer ./dist/metadata.json

  Cache management:

  npx expo start --clear       # Czyści Metro cache
  rm -rf node_modules/.cache   # Czyści cache Node
  npx expo prebuild --clean    # Czyści native code

  Environment variables:

  # Development
  EXPO_PUBLIC_API_URL=http://localhost:3000 npm start

  # Production  
  EXPO_PUBLIC_API_URL=https://api.production.com npm run build:prod

  ---
  9. Troubleshooting

  Typowe problemy:

  # Problem z Metro cache
  npx expo start --clear

  # Problem z node_modules
  rm -rf node_modules && npm install

  # Problem z Expo cache
  npx expo prebuild --clean

  # Problem z EAS
  eas build:cancel  # Anuluje aktywne buildy
  eas build --clear-cache

  To pokrywa wszystkie główne opcje budowania w Expo - od lokalnego developmentu po produkcyjne wdrożenia.