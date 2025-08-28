/**
 * Konfiguracja loggera Reanimated
 * 
 * Wyłącza ostrzeżenia związane z odczytem shared values podczas renderowania.
 * Te ostrzeżenia często pochodzą z bibliotek zewnętrznych jak @gorhom/bottom-sheet.
 */

import { LogLevel, configureReanimatedLogger as configureLogger } from 'react-native-reanimated';

/**
 * Konfiguruje logger Reanimated aby wyłączyć ostrzeżenia
 */
export function configureReanimatedLogger() {
  try {
    // Próba wyłączenia wszystkich ostrzeżeń Reanimated
    configureLogger({
      level: LogLevel.warn,
      strict: false,
    });
    console.log('✅ Reanimated logger: Ostrzeżenia wyłączone');
  } catch (error) {
    // Fallback jeśli API nie jest dostępne
    console.log('⚠️ Reanimated logger: Używam konfiguracji z babel.config.js');
    
    // Próba wyłączenia przez globalną flagę (może działać w niektórych wersjach)
    if (global && typeof global === 'object') {
      (global as any).__reanimatedWorkletInit = () => {};
      (global as any).__DEV__ = false; // Wyłącz dev mode dla Reanimated
    }
  }
}
