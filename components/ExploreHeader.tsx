import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sport, useSportsQuery } from '../lib/react-query/useSportsQuery';
import { useCategoryStore } from '../lib/zustand/categoryStore';
import { useBottomSheetStore } from '../lib/zustand/bottomSheetStore';

// Importy ikon SVG (bez zmian)
import AirsoftIcon from '../assets/icons/categories/airsoft.svg';
import AmericanFootballIcon from '../assets/icons/categories/american_football.svg';
import ArcheryIcon from '../assets/icons/categories/archery.svg';
import AthleticsIcon from '../assets/icons/categories/athletics.svg';
import BadmintonIcon from '../assets/icons/categories/badminton.svg';
import BaseballIcon from '../assets/icons/categories/baseball.svg';
import BasketballIcon from '../assets/icons/categories/basketball.svg';
import BeachHandballIcon from '../assets/icons/categories/beach_handball.svg';
import BeachVolleyballIcon from '../assets/icons/categories/beach_volleyball.svg';
import BeachSoccerIcon from '../assets/icons/categories/beachsoccer.svg';
import BilliardsIcon from '../assets/icons/categories/billiards.svg';
import BMXIcon from '../assets/icons/categories/bmx.svg';
import BoardGameIcon from '../assets/icons/categories/board_game.svg';
import BoulesIcon from '../assets/icons/categories/boules.svg';
import BowlingIcon from '../assets/icons/categories/bowling.svg';
import CalisthenicsIcon from '../assets/icons/categories/calisthenics.svg';
import ChessIcon from '../assets/icons/categories/chess.svg';
import CricketIcon from '../assets/icons/categories/cricket.svg';
import CrossfitIcon from '../assets/icons/categories/crossfit.svg';
import CurlingIcon from '../assets/icons/categories/curling.svg';
import DartsIcon from '../assets/icons/categories/darts.svg';
import DodgeballIcon from '../assets/icons/categories/dodgeball.svg';
import FieldHockeyIcon from '../assets/icons/categories/field_hockey.svg';
import FistballIcon from '../assets/icons/categories/fistball.svg';
import FitnessIcon from '../assets/icons/categories/fitness.svg';
import FloorballIcon from '../assets/icons/categories/floorball.svg';
import FunnelBallIcon from '../assets/icons/categories/funnel_ball.svg';
import FutsalIcon from '../assets/icons/categories/futsal.svg';
import GolfIcon from '../assets/icons/categories/golf.svg';
import HandballIcon from '../assets/icons/categories/handball.svg';
import IceHockeyIcon from '../assets/icons/categories/ice_hockey.svg';
import IceSkatingIcon from '../assets/icons/categories/ice_skating.svg';
import KickScooterIcon from '../assets/icons/categories/kick_scooter.svg';
import LaserTagIcon from '../assets/icons/categories/laser_tag.svg';
import MiniatureGolfIcon from '../assets/icons/categories/miniature_golf.svg';
import MountainBikingIcon from '../assets/icons/categories/mountain_biking.svg';
import NetballIcon from '../assets/icons/categories/netball.svg';
import PadelIcon from '../assets/icons/categories/padel.svg';
import PaintballIcon from '../assets/icons/categories/paintball.svg';
import PannaIcon from '../assets/icons/categories/panna.svg';
import PlayingAdventureIcon from '../assets/icons/categories/playing_adventure.svg';
import PlayingAirSportsIcon from '../assets/icons/categories/playing_air_sports.svg';
import PlayingBaseballIcon from '../assets/icons/categories/playing_baseball.svg';
import PlayingBasketballIcon from '../assets/icons/categories/playing_basketball.svg';
import PlayingBoardGamesIcon from '../assets/icons/categories/playing_board_games.svg';
import PlayingBowlingBilliardsIcon from '../assets/icons/categories/playing_bowling_billiards.svg';
import PlayingCombatIcon from '../assets/icons/categories/playing_combat.svg';
import PlayingCyclingIcon from '../assets/icons/categories/playing_cycling.svg';
import PlayingFootballIcon from '../assets/icons/categories/playing_football.svg';
import PlayingGolfIcon from '../assets/icons/categories/playing_golf.svg';
import PlayingGymnasticsIcon from '../assets/icons/categories/playing_gymnastics.svg';
import PlayingHandballIcon from '../assets/icons/categories/playing_handball.svg';
import PlayingHockeyIcon from '../assets/icons/categories/playing_hockey.svg';
import PlayingHorseRidingIcon from '../assets/icons/categories/playing_horse_riding.svg';
import PlayingMotorSportsIcon from '../assets/icons/categories/playing_motor_sports.svg';
import PlayingRugbyIcon from '../assets/icons/categories/playing_rugby.svg';
import PlayingRunningIcon from '../assets/icons/categories/playing_running.svg';
import PlayingSailingIcon from '../assets/icons/categories/playing_sailing.svg';
import PlayingShootingIcon from '../assets/icons/categories/playing_shooting.svg';
import PlayingSkatingIcon from '../assets/icons/categories/playing_skating.svg';
import PlayingSkiingIcon from '../assets/icons/categories/playing_skiing.svg';
import PlayingStrengthIcon from '../assets/icons/categories/playing_strength_fitness.svg';
import PlayingSwimmingIcon from '../assets/icons/categories/playing_swimming.svg';
import PlayingTennisIcon from '../assets/icons/categories/playing_tennis.svg';
import PlayingVolleyballIcon from '../assets/icons/categories/playing_volleyball.svg';
import RacquetballIcon from '../assets/icons/categories/racquetball.svg';
import RoadCyclingIcon from '../assets/icons/categories/road_cycling.svg';
import RollerHockeyIcon from '../assets/icons/categories/roller_hockey.svg';
import RollerSkatingIcon from '../assets/icons/categories/roller_skating.svg';
import RugbyIcon from '../assets/icons/categories/rugby.svg';
import RunningIcon from '../assets/icons/categories/running.svg';
import ShootingIcon from '../assets/icons/categories/shooting.svg';
import SimpleSquareIcon from '../assets/icons/categories/simple_square.svg';
import SkateboardIcon from '../assets/icons/categories/skateboard.svg';
import SoccerIcon from '../assets/icons/categories/soccer.svg';
import SoftballIcon from '../assets/icons/categories/softball.svg';
import SportsWalkIcon from '../assets/icons/categories/sports_walk.svg';
import SquashIcon from '../assets/icons/categories/squash.svg';
import StreetballIcon from '../assets/icons/categories/streetball.svg';
import TableTennisIcon from '../assets/icons/categories/table_tennis.svg';
import TennisIcon from '../assets/icons/categories/tennis.svg';
import TeqballIcon from '../assets/icons/categories/teqball.svg';
import VolleyballIcon from '../assets/icons/categories/volleyball.svg';
import WeightliftingIcon from '../assets/icons/categories/weightlifting.svg';
import YogaIcon from '../assets/icons/categories/yoga.svg';


const iconMap: Record<string, React.FC<any>> = {
  playing_baseball: PlayingBaseballIcon,
  playing_board_games: PlayingBoardGamesIcon,
  playing_basketball: PlayingBasketballIcon,
  playing_bowling_billiards: PlayingBowlingBilliardsIcon,
  playing_combat: PlayingCombatIcon,
  playing_cycling: PlayingCyclingIcon,
  playing_golf: PlayingGolfIcon,
  playing_handball: PlayingHandballIcon,
  playing_gymnastics: PlayingGymnasticsIcon,
  playing_hockey: PlayingHockeyIcon,
  playing_motor_sports: PlayingMotorSportsIcon,
  playing_rugby: PlayingRugbyIcon,
  playing_running: PlayingRunningIcon,
  playing_sailing: PlayingSailingIcon,
  playing_shooting: PlayingShootingIcon,
  playing_skating: PlayingSkatingIcon,
  playing_skiing: PlayingSkiingIcon,
  playing_football: PlayingFootballIcon,
  playing_swimming: PlayingSwimmingIcon,
  playing_tennis: PlayingTennisIcon,
  playing_volleyball: PlayingVolleyballIcon,
  playing_air_sports: PlayingAirSportsIcon,
  playing_adventure: PlayingAdventureIcon,
  soccer: SoccerIcon,
  streetball: StreetballIcon,
  volleyball: VolleyballIcon,
  basketball: BasketballIcon,
  fistball: FistballIcon,
  beachvolleyball: BeachVolleyballIcon,
  panna: PannaIcon,
  tennis: TennisIcon,
  teqball: TeqballIcon,
  playing_horse_riding: PlayingHorseRidingIcon,
  simple_square: SimpleSquareIcon,
  playing_strength_fitness: PlayingStrengthIcon,
  futsal: FutsalIcon,
  beachsoccer: BeachSoccerIcon,
  netball: NetballIcon,
  funnel_ball: FunnelBallIcon,
  badminton: BadmintonIcon,
  squash: SquashIcon,
  table_tennis: TableTennisIcon,
  padel: PadelIcon,
  racquetball: RacquetballIcon,
  weightlifting: WeightliftingIcon,
  crossfit: CrossfitIcon,
  calisthenics: CalisthenicsIcon,
  fitness: FitnessIcon,
  yoga: YogaIcon,
  roller_skating: RollerSkatingIcon,
  skateboard: SkateboardIcon,
  ice_skating: IceSkatingIcon,
  bmx: BMXIcon,
  kick_scooter: KickScooterIcon,
  mountain_biking: MountainBikingIcon,
  road_cycling: RoadCyclingIcon,
  bowling: BowlingIcon,
  billiards: BilliardsIcon,
  boules: BoulesIcon,
  chess: ChessIcon,
  board_game: BoardGameIcon,
  handball: HandballIcon,
  beach_handball: BeachHandballIcon,
  dodgeball: DodgeballIcon,
  ice_hockey: IceHockeyIcon,
  roller_hockey: RollerHockeyIcon,
  floorball: FloorballIcon,
  field_hockey: FieldHockeyIcon,
  curling: CurlingIcon,
  american_football: AmericanFootballIcon,
  rugby: RugbyIcon,
  running: RunningIcon,
  sports_walk: SportsWalkIcon,
  athletics: AthleticsIcon,
  softball: SoftballIcon,
  baseball: BaseballIcon,
  cricket: CricketIcon,
  archery: ArcheryIcon,
  shooting: ShootingIcon,
  darts: DartsIcon,
  laser_tag: LaserTagIcon,
  paintball: PaintballIcon,
  airsoft: AirsoftIcon,
  miniature_golf: MiniatureGolfIcon,
  golf: GolfIcon,
};


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
  const { isPopupOpen } = useBottomSheetStore();

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
    // Block category change when popup is open
    if (isPopupOpen) {
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
    // Block category change when popup is open
    if (isPopupOpen) {
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
    // Block category change when popup is open
    if (isPopupOpen) {
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
    const IconComponent = iconMap[item.iconName] || iconMap['simple_square'];
    
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
            className={`text-[10px] font-medium text-center ${
              isActive ? 'text-white' : 'text-black' // 🎨 PARAMETR: Kolor tekstu (aktywna biała/nieaktywna czarna)
            }`}
            numberOfLines={1}     // 🎨 PARAMETR: Maksymalna liczba linii tekstu
            ellipsizeMode="tail"  // 🎨 PARAMETR: Sposób skracania tekstu ('tail', 'head', 'middle')
            style={{ 
              textAlign: 'center',
              flexShrink: 0,
              lineHeight: 12,     // 🎨 PARAMETR: Wysokość linii tekstu
            }}
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
      <SafeAreaView edges={['top']} className="">
        <View 
          className="h-20 items-center justify-center" // 🎨 PARAMETR: Wysokość kontenera podczas ładowania
        >
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
      <SafeAreaView edges={['top']} className="">
        <View 
          className="h-20 items-center justify-center px-5" // 🎨 PARAMETR: Wysokość i padding kontenera błędu
        >
          <Text 
            className="text-center text-red-500" // 🎨 PARAMETR: Kolor tekstu błędu
          >
            Wystąpił błąd podczas ładowania kategorii: {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===== GŁÓWNY RENDER KOMPONENTU =====
  return (
    <View 
      className="absolute top-0 left-0 right-0 z-50" // 🎨 PARAMETR: Pozycjonowanie (absolute) i z-index
    >
      <SafeAreaView 
        edges={['top']} 
        className="mx-3 mt-1" // 🎨 PARAMETR: Margines poziomy
      >
        <View 
          className="bg-white shadow-lg" // 🎨 PARAMETR: Kolor tła i intensywność cienia
          style={{
            borderRadius: 20,           // 🎨 PARAMETR: Zaokrąglenie głównego kontenera (50 = pełne półkola)
            shadowColor: '#000',        // 🎨 PARAMETR: Kolor cienia
            shadowOffset: { width: 0, height: 4 }, // 🎨 PARAMETR: Przesunięcie cienia (x, y)
            shadowOpacity: 0.1,         // 🎨 PARAMETR: Przezroczystość cienia (0.0-1.0)
            shadowRadius: 12,           // 🎨 PARAMETR: Rozmycie cienia
            elevation: 8,               // 🎨 PARAMETR: Wysokość cienia na Androidzie
            overflow: 'hidden',
          }}
        >
          {!selectedMainCategory ? (
            // ===== WIDOK GŁÓWNYCH KATEGORII =====
            <ScrollView
              className="h-[60px]"  // 🎨 PARAMETR: Wysokość ScrollView
              ref={mainCategoriesScrollViewRef}
              horizontal={true}     // 🎨 PARAMETR: Przewijanie poziome
              showsHorizontalScrollIndicator={false} // 🎨 PARAMETR: Ukrywanie wskaźnika przewijania
              onScroll={(event) => {
                mainCategoryScrollPosition.current =
                  event.nativeEvent.contentOffset.x;
              }}
              scrollEventThrottle={16} // 🎨 PARAMETR: Częstotliwość zdarzeń scroll (ms)
              contentContainerStyle={{
                paddingLeft: 4,     // 🎨 PARAMETR: Padding lewy zawartości ScrollView
                paddingRight: 4,    // 🎨 PARAMETR: Padding prawy zawartości ScrollView
                paddingVertical: 2,  // 🎨 PARAMETR: Padding górny i dolny zawartości
                alignItems: 'center',
              }}
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
              className="h-[60px]"  // 🎨 PARAMETR: Wysokość ScrollView podkategorii (80px)
              ref={subCategoriesScrollViewRef}
              horizontal={true}     // 🎨 PARAMETR: Przewijanie poziome
              showsHorizontalScrollIndicator={false} // 🎨 PARAMETR: Ukrywanie wskaźnika przewijania
              contentContainerStyle={{
                paddingLeft: 4,     // 🎨 PARAMETR: Padding lewy zawartości ScrollView podkategorii
                paddingRight: 4,    // 🎨 PARAMETR: Padding prawy zawartości ScrollView podkategorii
                paddingVertical: 2,  // 🎨 PARAMETR: Padding górny i dolny zawartości podkategorii
                alignItems: 'center',
              }}
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
              const IconComponent =
                iconMap[selectedMainCategory.iconName] ||
                iconMap['simple_square'];
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
                      className={`text-[10px] font-medium text-center ${
                        isActive ? 'text-white' : 'text-black' // 🎨 PARAMETR: Kolor tekstu przypiętej kategorii (aktywna biała/nieaktywna czarna)
                      }`}
                      numberOfLines={1}     // 🎨 PARAMETR: Maksymalna liczba linii tekstu przypiętej kategorii
                      ellipsizeMode="tail"  // 🎨 PARAMETR: Sposób skracania tekstu przypiętej kategorii
                      style={{ 
                        textAlign: 'center',
                        flexShrink: 0,
                        lineHeight: 12,     // 🎨 PARAMETR: Wysokość linii tekstu przypiętej kategorii
                      }}
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
                <View 
                  className="flex-1 items-center justify-center px-4" // 🎨 PARAMETR: Padding poziomy komunikatu (px-4 = 16px)
                >
                  <Text 
                    className="text-sm text-gray-500" // 🎨 PARAMETR: Rozmiar (text-sm) i kolor tekstu komunikatu (text-gray-500)
                  >
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

export default ExploreHeader;
