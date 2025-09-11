import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook do wyliczania rzeczywistej wysokości ExploreHeader
 * Bazuje na rzeczywistych wymiarach z komponentu ExploreHeader
 */
export const useExploreHeaderHeight = () => {
  const insets = useSafeAreaInsets();
  
  // Składowe wysokości ExploreHeader (na podstawie styles z ExploreHeader.tsx):
  const SCROLL_VIEW_HEIGHT = 60;        // styles.scrollView.height
  const PADDING_VERTICAL = 4;           // styles.scrollContentContainer.paddingVertical * 2
  const MARGIN_TOP = 4;                 // styles.safeArea.marginTop
  
  // Całkowita wysokość ExploreHeader
  const exploreHeaderHeight = insets.top + SCROLL_VIEW_HEIGHT + PADDING_VERTICAL + MARGIN_TOP;
  
  /**
   * Zwraca wysokość ExploreHeader z opcjonalnym buforem (odstępem)
   * @param buffer - dodatkowy odstęp w pikselach (domyślnie -10px)
   */
  const getExploreHeaderHeightWithBuffer = (buffer: number = -70) => {
    return exploreHeaderHeight + buffer;
  };
  
  /**
   * Zwraca pozycję dla Popup nad navigationTab z opcjonalnym buforem
   * @param buffer - dodatkowy odstęp w pikselach nad navigationTab (domyślnie 20px)
   */
  const getPopupBottomPosition = (buffer: number = 10) => {
    // Wysokość navigation bar (tak samo jak w _layout.tsx i FacilityBottomSheet)
    // iOS: 60 + insets.bottom, Android: 70
    const navigationBarHeight = Platform.OS === 'ios' ? 60 + insets.bottom : 70;
    
    // Dynamiczne obliczanie wysokości reklamy (tak samo jak w _layout.tsx)
    // Na urządzeniach bez Home Indicator - insets.bottom = 0, więc reklama sama dodaje padding
    // Na urządzeniach z Home Indicator - insets.bottom > 0, więc nie dodajemy dodatkowego paddingu
    const adBaseHeight = 60;
    const adContainerHeight = adBaseHeight + (insets.bottom > 0 ? insets.bottom : 0);
    
    return navigationBarHeight + adContainerHeight + buffer;
  };

  return {
    exploreHeaderHeight,
    getExploreHeaderHeightWithBuffer,
    getPopupBottomPosition,
    // Komponenty składowe dla debugowania
    components: {
      safeAreaTop: insets.top,
      scrollViewHeight: SCROLL_VIEW_HEIGHT,
      paddingVertical: PADDING_VERTICAL,
      marginTop: MARGIN_TOP,
    }
  };
};