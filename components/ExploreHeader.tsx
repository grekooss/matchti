import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sport, useSportsQuery } from '../lib/react-query/useSportsQuery';
import { useCategoryStore } from '../lib/zustand/categoryStore';
import { useBottomSheetStore } from '../lib/zustand/bottomSheetStore';
import { NeumorphicButton } from './ui/NeumorphicButton';

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

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
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
      setActiveCategory(undefined); // Aktualizacja globalnego stanu
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
      // Odkliknięcie podkategorii
      setSelectedSubCategory(undefined);
      // Globalny stan powinien odzwierciedlać główną kategorię, jeśli podkategoria jest odznaczona
      if (selectedMainCategory) {
        setActiveCategory(selectedMainCategory.id);
      }
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
      setActiveCategory(undefined); // Aktualizacja globalnego stanu
    }
  };

  const renderCategoryItem = (
    item: Sport,
    onPress: () => void,
    isActive: boolean
  ) => {
    const IconComponent = iconMap[item.iconName] || iconMap['simple_square'];
    const iconElement = <IconComponent />;

    return (
      <View key={item.id} style={{ minWidth: 78, alignItems: 'center' }}>
        <NeumorphicButton
          onPress={onPress}
          text={item.name}
          icon={iconElement}
          outerColors={isActive ? ['#99A0A966', '#FFFFFF66'] : undefined}
          middleColors={isActive ? ['#D99AFA', '#BA3D4F'] : undefined}
          innerColors={isActive ? ['#D99AFA', '#BA3D4F'] : undefined}
          textColor={isActive ? 'black' : 'black'}
          iconColor={isActive ? 'white' : '#71717a'}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="">
        <View className="h-20 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView edges={['top']} className="">
        <View className="h-20 items-center justify-center px-5">
          <Text className="text-center text-red-500">
            Wystąpił błąd podczas ładowania kategorii: {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="pb-2">
      {!selectedMainCategory ? (
        // Widok głównych kategorii
        <ScrollView
          className="h-[84px]"
          ref={mainCategoriesScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            mainCategoryScrollPosition.current =
              event.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16} // Optymalizacja dla onScroll
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 10,
            gap: 12,
            paddingVertical: 0, // Usunięty padding pionowy dla lepszego dopasowania
            alignItems: 'flex-end', // Wyrównanie elementów do dołu
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
        // Widok wybranej kategorii głównej i jej podkategorii
        <ScrollView
          className="h-[84px]"
          ref={subCategoriesScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 10,
            gap: 12,
            paddingVertical: 0,
            alignItems: 'flex-end',
          }}
        >
          {/* Przypięta kategoria główna jako pierwszy element */}
          <View
            key="main-category"
            style={{ minWidth: 78, alignItems: 'center' }}
          >
            {(() => {
              const IconComponent =
                iconMap[selectedMainCategory.iconName] ||
                iconMap['simple_square'];
              const isActive = !selectedSubCategory;
              return (
                <NeumorphicButton
                  onPress={handleGoBackToMainCategories}
                  text={selectedMainCategory.name}
                  icon={<IconComponent />}
                  outerColors={
                    isActive ? ['#99A0A966', '#FFFFFF66'] : undefined
                  }
                  middleColors={isActive ? ['#D99AFA', '#BA3D4F'] : undefined}
                  innerColors={isActive ? ['#D99AFA', '#BA3D4F'] : undefined}
                  textColor={isActive ? 'black' : 'black'}
                  iconColor={isActive ? 'white' : '#71717a'}
                />
              );
            })()}
          </View>

          {/* Podkategorie jako kolejne elementy */}
          {[...(subCategoriesMap.get(selectedMainCategory.id) || [])]
            .reverse()
            .map((subCategory) =>
              renderCategoryItem(
                subCategory,
                () => handleSelectSubCategory(subCategory),
                activeCategory === subCategory.id
              )
            )}

          {/* Komunikat o braku podkategorii */}
          {(subCategoriesMap.get(selectedMainCategory.id) || []).length ===
            0 && (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-sm text-gray-500">
                Brak podkategorii dla {selectedMainCategory.name}.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ExploreHeader;
