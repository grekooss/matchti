import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sport, useSportsQuery } from '../lib/react-query/useSportsQuery';
import { useCategoryStore } from '../lib/zustand/categoryStore';
import { useBottomSheetStore } from '../lib/zustand/bottomSheetStore';

// Import centralnego systemu zarządzania ikonami sportów
import { getSportIcon } from '../lib/constants/sportIcons';


/**
 * ===============================================================================
 * PARAMETRY WIZUALNE I KONFIGURACYJNE EXPLOREHEADER - PEŁNY PRZEWODNIK
 * ===============================================================================
 * 
 * 🎨 Ten komponent zawiera liczne parametry wizualne oznaczone symbolem 🎨 PARAMETR
 * 
 * GŁÓWNE KATEGORIE PARAMETRÓW:
 * 
 * 1. POZYCJONOWANIE I LAYOUT:
 *    - Pozycja komponenta (absolute, z-index: 50)
 *    - Marginesy zewnętrzne (mx-4 = 16px poziomo, mt-2 = 8px góra)
 *    - Wysokość ScrollView (h-[80px] = 80px)
 * 
 * 2. TŁO I CIEŃ GŁÓWNEGO KONTENERA:
 *    - Kolor tła: bg-white
 *    - Zaokrąglenie: borderRadius: 50 (pełne półkola)
 *    - Kolor cienia: shadowColor: '#000'
 *    - Pozycja cienia: shadowOffset: {width: 0, height: 4}
 *    - Przezroczystość cienia: shadowOpacity: 0.1
 *    - Rozmycie cienia: shadowRadius: 12
 *    - Wysokość cienia Android: elevation: 8
 * 
 * 3. SCROLL VIEW (główne kategorie i podkategorie):
 *    - Padding zawartości: paddingLeft/Right: 16px, paddingVertical: 8px
 *    - Odstępy między elementami: gap: 12px
 *    - Wskaźnik przewijania: showsHorizontalScrollIndicator: false
 *    - Częstotliwość zdarzeń scroll: scrollEventThrottle: 16ms
 * 
 * 4. POJEDYNCZY ELEMENT KATEGORII:
 *    - Szerokość elementu: width: 80px
 *    - Padding przycisku: paddingHorizontal: 4px, paddingVertical: 2px
 *    - Przezroczystość po naciśnięciu: activeOpacity: 0.7
 * 
 * 5. IKONA KATEGORII:
 *    - Rozmiar ikony SVG: width: 24px, height: 24px
 *    - Kolor tła aktywnej kategorii: backgroundColor: '#069494'
 *    - Zaokrąglenie tła aktywnej: borderRadius: 50
 *    - Padding kontenera ikony: paddingHorizontal: 8px, paddingVertical: 4px
 *    - Minimalne wymiary kontenera: minWidth: 40px, minHeight: 40px
 * 
 * 6. TEKST KATEGORII:
 *    - Rozmiar czcionki: text-[11px] (11px)
 *    - Maksymalna liczba linii: numberOfLines: 2
 *    - Wysokość linii: lineHeight: 14px
 *    - Szerokość obszaru tekstu: width: 72px
 *    - Kolor tekstu aktywnej: text-white
 *    - Kolor tekstu nieaktywnej: text-primary
 *    - Sposób skracania: ellipsizeMode: 'tail'
 * 
 * 7. FALLBACK IKONY:
 *    - Rozmiar fallback ikony: width: 24px, height: 24px
 *    - Kolor fallback (aktywna): backgroundColor: '#FFFFFF'
 *    - Kolor fallback (nieaktywna): backgroundColor: '#069494'
 *    - Zaokrąglenie fallback: borderRadius: 4px
 * 
 * 8. STANY LOADING I ERROR:
 *    - Wysokość kontenera loading/error: h-20 (80px)
 *    - Rozmiar spinnera: size: 'large'
 *    - Kolor spinnera: color: '#0000ff'
 *    - Kolor tekstu błędu: text-red-500
 *    - Padding kontenera błędu: px-5 (20px poziomo)
 * 
 * 9. KOMUNIKATY:
 *    - Rozmiar tekstu komunikatu: text-sm
 *    - Kolor tekstu komunikatu: text-gray-500
 *    - Padding komunikatu: px-4 (16px poziomo)
 * 
 * 10. PORZĄDEK WYŚWIETLANIA:
 *     - Kolejność podkategorii: .reverse() (odwrócona)
 * 
 * KOLORY UŻYTE W KOMPONENCIE:
 * - Główny kolor aplikacji (aktywna kategoria): #069494
 * - Tło głównego kontenera: white
 * - Cień: #000 (opacity: 0.1)
 * - Tekst aktywnej kategorii: white
 * - Tekst nieaktywnej kategorii: text-primary (z Tailwind)
 * - Tekst błędu: red-500 (z Tailwind)
 * - Tekst komunikatu: gray-500 (z Tailwind)
 * - Spinner: #0000ff
 * 
 * WYMIARY KLUCZOWE:
 * - Wysokość komponenta: 80px
 * - Szerokość elementu kategorii: 80px
 * - Szerokość ikony: 24px × 24px
 * - Minimalna wielkość kontenera ikony aktywnej: 40px × 40px
 * - Szerokość obszaru tekstu: 72px
 * - Odstępy między elementami: 12px
 * - Padding ScrollView: 16px (lewy/prawy), 8px (górny/dolny)
 * 
 * ===============================================================================
 */
const ExploreHeader = () => {
  const { data: sports, isLoading, error } = useSportsQuery();
  const { activeCategory, setActiveCategory } = useCategoryStore();
  const { isPopupOpen, isBottomSheetExpanded } = useBottomSheetStore();

  // ExploreHeader jest zablokowany gdy popup jest otwarty LUB bottomsheet jest rozwinięty
  const isBlocked = isPopupOpen || isBottomSheetExpanded;

  // Debug log
  console.log('🎯 ExploreHeader render - isPopupOpen:', isPopupOpen, 'isBottomSheetExpanded:', isBottomSheetExpanded, 'isBlocked:', isBlocked);

  const [selectedMainCategory, setSelectedMainCategory] = useState<
    Sport | undefined
  >(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    Sport | undefined
  >(undefined);

  const mainCategoriesScrollViewRef = useRef<ScrollView>(null);
  const subCategoriesScrollViewRef = useRef<ScrollView>(null);
  const mainCategoryScrollPosition = useRef(0);

  const { mainCategories, subCategoriesMap } = useMemo(() => {
    if (!sports) return { mainCategories: [], subCategoriesMap: new Map() };

    const main: Sport[] = [];
    const subMap = new Map<number, Sport[]>();

    sports.forEach((sport) => {
      if (
        sport.parent_sport_id === null ||
        sport.parent_sport_id === undefined
      ) {
        main.push(sport);
      } else {
        const parentSubs = subMap.get(sport.parent_sport_id) || [];
        parentSubs.push(sport);
        subMap.set(sport.parent_sport_id, parentSubs);
      }
    });
    return { mainCategories: main, subCategoriesMap: subMap };
  }, [sports]);

  // Efekt do przywracania pozycji scrolla przy zmianie widoku
  useEffect(() => {
    if (selectedMainCategory) {
      // Gdy wybieramy kategorię główną, resetujemy scroll podkategorii
      subCategoriesScrollViewRef.current?.scrollTo({ x: 0, animated: false });
    } else if (mainCategoriesScrollViewRef.current) {
      // Gdy wracamy do widoku kategorii głównych, przywracamy pozycję scrolla
      // Używamy setTimeout, aby upewnić się, że widok jest gotowy
      setTimeout(() => {
        mainCategoriesScrollViewRef.current?.scrollTo({
          x: mainCategoryScrollPosition.current,
          animated: false,
        });
      }, 0);
    }
  }, [selectedMainCategory]);

  const handleSelectMainCategory = (category: Sport) => {
    // Blokuj interakcje gdy popup jest otwarty lub bottomsheet rozwinięty
    if (isBlocked) {
      return;
    }
    
    if (selectedMainCategory?.id === category.id && !selectedSubCategory) {
      // Odkliknięcie głównej kategorii (jeśli nie ma wybranej podkategorii)
      setSelectedMainCategory(undefined);
      setSelectedSubCategory(undefined);
      setActiveCategory(null); // Aktualizacja globalnego stanu
    } else {
      // Wybór nowej głównej kategorii lub kliknięcie na już wybraną (gdy jest podkategoria)
      setSelectedMainCategory(category);
      setSelectedSubCategory(undefined); // Zawsze resetuj podkategorię przy zmianie głównej
      setActiveCategory(category.id); // Aktualizacja globalnego stanu
    }
  };

  const handleSelectSubCategory = (subCategory: Sport) => {
    // Blokuj interakcje gdy popup jest otwarty lub bottomsheet rozwinięty
    if (isBlocked) {
      return;
    }
    
    if (selectedSubCategory?.id === subCategory.id) {
      // Odkliknięcie podkategorii - przejście do widoku kategorii głównych
      setSelectedSubCategory(undefined);
      setSelectedMainCategory(undefined);
      setActiveCategory(null); // Wyczyść wszystkie wybory i wróć do głównych kategorii
    } else {
      // Wybór nowej podkategorii
      setSelectedSubCategory(subCategory);
      setActiveCategory(subCategory.id); // Aktualizacja globalnego stanu
    }
  };

  const handleGoBackToMainCategories = () => {
    // Blokuj interakcje gdy popup jest otwarty lub bottomsheet rozwinięty
    if (isBlocked) {
      return;
    }
    
    if (selectedSubCategory) {
      // Jeśli jest wybrana podkategoria, zaznacz tylko kategorię główną
      setSelectedSubCategory(undefined);
      if (selectedMainCategory) {
        setActiveCategory(selectedMainCategory.id); // Aktualizacja globalnego stanu
      }
    } else {
      // Jeśli nie ma wybranej podkategorii, wyczyść wszystkie wybory
      setSelectedMainCategory(undefined);
      setSelectedSubCategory(undefined);
      setActiveCategory(null); // Aktualizacja globalnego stanu
    }
  };

  // ===== FUNKCJA RENDEROWANIA POJEDYNCZEJ KATEGORII =====
  const renderCategoryItem = (
    item: Sport,
    onPress: () => void,
    isActive: boolean
  ) => {
    const IconComponent = getSportIcon(item.iconName, item.name);
    
    // Sprawdź czy IconComponent to rzeczywiście funkcja/komponent
    const isValidComponent = IconComponent && typeof IconComponent === 'function';
    
    return (
      <View 
        key={item.id} 
        style={{ 
          width: 80, // 🎨 PARAMETR: Szerokość pojedynczego elementu kategorii
          alignItems: 'center', 
          overflow: 'hidden' 
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          style={isActive ? {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#069494', // 🎨 PARAMETR: Kolor tła aktywnej kategorii obejmujący ikonę i tekst
            borderRadius: 20,           // 🎨 PARAMETR: Zaokrąglenie tła aktywnej kategorii
            paddingHorizontal: 8,       // 🎨 PARAMETR: Padding poziomy całego przycisku (aktywna)
            paddingVertical: 8,         // 🎨 PARAMETR: Padding pionowy całego przycisku (aktywna)
            width: 72,                  // 🎨 PARAMETR: Szerokość przycisku aktywnej kategorii
            maxHeight: 50,              // 🎨 PARAMETR: Minimalna wysokość przycisku aktywnej kategorii
          } : {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,       // 🎨 PARAMETR: Padding poziomy całego przycisku (nieaktywna)
            paddingVertical: 8,         // 🎨 PARAMETR: Padding pionowy całego przycisku (nieaktywna)
            width: 72,                  // 🎨 PARAMETR: Szerokość przycisku nieaktywnej kategorii
            maxHeight: 50,              // 🎨 PARAMETR: Minimalna wysokość przycisku nieaktywnej kategorii
          }}
          activeOpacity={0.7} // 🎨 PARAMETR: Przezroczystość po naciśnięciu (0.0-1.0)
        >
          <View 
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,            // 🎨 PARAMETR: Odstęp między ikoną a tekstem
            }}
          >
            {isValidComponent ? (
              <IconComponent 
                width={24}  // 🎨 PARAMETR: Szerokość ikony SVG
                height={24} // 🎨 PARAMETR: Wysokość ikony SVG
                stroke={isActive ? '#FFFFFF' : '#000000'} // 🎨 PARAMETR: Kolor stroke ikony (aktywna biała/nieaktywna czarna)
                color={isActive ? '#FFFFFF' : '#000000'} // 🎨 PARAMETR: Kolor ikony (aktywna biała/nieaktywna czarna)
              />
            ) : (
              // Fallback dla brakujących ikon
              <View 
                style={{
                  width: 24,  // 🎨 PARAMETR: Szerokość fallback ikony
                  height: 24, // 🎨 PARAMETR: Wysokość fallback ikony
                  backgroundColor: isActive ? '#FFFFFF' : '#000000', // 🎨 PARAMETR: Kolor fallback ikony (aktywna biała/nieaktywna czarna)
                  borderRadius: 4, // 🎨 PARAMETR: Zaokrąglenie fallback ikony
                }} 
              />
            )}
          </View>
          <Text 
            style={[
              styles.categoryText,
              isActive ? styles.activeCategoryText : styles.inactiveCategoryText
            ]}
            numberOfLines={1}     // 🎨 PARAMETR: Maksymalna liczba linii tekstu
            ellipsizeMode="tail"  // 🎨 PARAMETR: Sposób skracania tekstu ('tail', 'head', 'middle')
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ===== STANY LOADING I ERROR =====
  if (isLoading) {
    return (
      <SafeAreaView edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large"      // 🎨 PARAMETR: Rozmiar spinnera ('small', 'large')
            color="#0000ff"   // 🎨 PARAMETR: Kolor spinnera
          />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Wystąpił błąd podczas ładowania kategorii: {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===== GŁÓWNY RENDER KOMPONENTU =====
  // ExploreHeader jest zawsze widoczny

  return (
    <View 
      style={styles.container}
      pointerEvents={isBlocked ? 'none' : 'auto'}
    >
      <SafeAreaView 
        edges={['top']} 
        style={styles.safeArea}
      >
        <View style={styles.mainContainer}
        >
          {!selectedMainCategory ? (
            // ===== WIDOK GŁÓWNYCH KATEGORII =====
            <ScrollView
              style={styles.scrollView}
              ref={mainCategoriesScrollViewRef}
              horizontal={true}     // 🎨 PARAMETR: Przewijanie poziome
              showsHorizontalScrollIndicator={false} // 🎨 PARAMETR: Ukrywanie wskaźnika przewijania
              onScroll={(event) => {
                mainCategoryScrollPosition.current =
                  event.nativeEvent.contentOffset.x;
              }}
              scrollEventThrottle={16} // 🎨 PARAMETR: Częstotliwość zdarzeń scroll (ms)
              contentContainerStyle={styles.scrollContentContainer}
            >
              {mainCategories.map((category) =>
                renderCategoryItem(
                  category,
                  () => handleSelectMainCategory(category),
                  activeCategory === category.id
                )
              )}
            </ScrollView>
          ) : (
            // ===== WIDOK PODKATEGORII =====
            <ScrollView
              style={styles.scrollView}
              ref={subCategoriesScrollViewRef}
              horizontal={true}     // 🎨 PARAMETR: Przewijanie poziome
              showsHorizontalScrollIndicator={false} // 🎨 PARAMETR: Ukrywanie wskaźnika przewijania
              contentContainerStyle={styles.scrollContentContainer}
            >
          {/* ===== PRZYPIĘTA KATEGORIA GŁÓWNA (pierwszy element w widoku podkategorii) ===== */}
          <View
            key="main-category"
            style={{ 
              width: 80,           // 🎨 PARAMETR: Szerokość przypiętej kategorii głównej
              alignItems: 'center', 
              overflow: 'hidden' 
            }}
          >
            {(() => {
              const IconComponent = getSportIcon(selectedMainCategory.iconName, selectedMainCategory.name);
              const isActive = !selectedSubCategory; // Aktywna, gdy nie ma wybranej podkategorii
              const isValidComponent = IconComponent && typeof IconComponent === 'function';
              
              return (
                <View style={{ width: 80, alignItems: 'center', overflow: 'hidden' }}>
                  <TouchableOpacity
                    onPress={handleGoBackToMainCategories}
                    style={isActive ? {
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#069494', // 🎨 PARAMETR: Kolor tła aktywnej przypiętej kategorii obejmujący ikonę i tekst
                      borderRadius: 20,           // 🎨 PARAMETR: Zaokrąglenie tła aktywnej przypiętej kategorii
                      paddingHorizontal: 8,       // 🎨 PARAMETR: Padding poziomy całego przycisku przypiętej kategorii (aktywna)
                      paddingVertical: 8,         // 🎨 PARAMETR: Padding pionowy całego przycisku przypiętej kategorii (aktywna)
                      width: 72,                  // 🎨 PARAMETR: Szerokość przycisku aktywnej przypiętej kategorii
                      maxHeight: 50,              // 🎨 PARAMETR: Minimalna wysokość przycisku aktywnej przypiętej kategorii
                    } : {
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 8,       // 🎨 PARAMETR: Padding poziomy całego przycisku przypiętej kategorii (nieaktywna)
                      paddingVertical: 8,         // 🎨 PARAMETR: Padding pionowy całego przycisku przypiętej kategorii (nieaktywna)
                      width: 72,                  // 🎨 PARAMETR: Szerokość przycisku nieaktywnej przypiętej kategorii
                      maxHeight: 50,              // 🎨 PARAMETR: Minimalna wysokość przycisku nieaktywnej przypiętej kategorii
                    }}
                    activeOpacity={0.7}   // 🎨 PARAMETR: Przezroczystość po naciśnięciu przypiętej kategorii
                  >
                    <View 
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 4,            // 🎨 PARAMETR: Odstęp między ikoną a tekstem przypiętej kategorii
                      }}
                    >
                      {isValidComponent ? (
                        <IconComponent 
                          width={24}  // 🎨 PARAMETR: Szerokość ikony SVG przypiętej kategorii
                          height={24} // 🎨 PARAMETR: Wysokość ikony SVG przypiętej kategorii
                          stroke={isActive ? '#FFFFFF' : '#000000'} // 🎨 PARAMETR: Kolor stroke ikony przypiętej kategorii (aktywna biała/nieaktywna czarna)
                          color={isActive ? '#FFFFFF' : '#000000'} // 🎨 PARAMETR: Kolor ikony przypiętej kategorii (aktywna biała/nieaktywna czarna)
                        />
                      ) : (
                        <View 
                          style={{
                            width: 24,  // 🎨 PARAMETR: Szerokość fallback ikony przypiętej kategorii
                            height: 24, // 🎨 PARAMETR: Wysokość fallback ikony przypiętej kategorii
                            backgroundColor: isActive ? '#FFFFFF' : '#000000', // 🎨 PARAMETR: Kolor fallback ikony (aktywna biała/nieaktywna czarna) przypiętej kategorii
                            borderRadius: 4, // 🎨 PARAMETR: Zaokrąglenie fallback ikony przypiętej kategorii
                          }} 
                        />
                      )}
                    </View>
                    <Text 
                      style={[
                        styles.categoryText,
                        isActive ? styles.activeCategoryText : styles.inactiveCategoryText
                      ]}
                      numberOfLines={1}     // 🎨 PARAMETR: Maksymalna liczba linii tekstu przypiętej kategorii
                      ellipsizeMode="tail"  // 🎨 PARAMETR: Sposób skracania tekstu przypiętej kategorii
                    >
                      {selectedMainCategory.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </View>

          {/* ===== LISTA PODKATEGORII ===== */}
          {[...(subCategoriesMap.get(selectedMainCategory.id) || [])]
            .reverse() // 🎨 PARAMETR: Kolejność podkategorii (reverse = odwrócona)
            .map((subCategory) =>
              renderCategoryItem(
                subCategory,
                () => handleSelectSubCategory(subCategory),
                activeCategory === subCategory.id
              )
            )}

              {/* ===== KOMUNIKAT O BRAKU PODKATEGORII ===== */}
              {(subCategoriesMap.get(selectedMainCategory.id) || []).length ===
                0 && (
                <View style={styles.noSubcategoriesContainer}>
                  <Text style={styles.noSubcategoriesText}>
                    Brak podkategorii dla {selectedMainCategory.name}.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  safeArea: {
    marginHorizontal: 12,
    marginTop: 4,
  },
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#EF4444',
  },
  scrollView: {
    height: 60,
  },
  scrollContentContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 0,
    lineHeight: 12,
  },
  activeCategoryText: {
    color: 'white',
  },
  inactiveCategoryText: {
    color: 'black',
  },
  noSubcategoriesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  noSubcategoriesText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ExploreHeader;
