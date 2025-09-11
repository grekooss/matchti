import React from 'react';

// Import wszystkich ikon z kategorii sportów
import AirsoftIcon from '../../assets/icons/categories/airsoft.svg';
import AlpineSkiingIcon from '../../assets/icons/categories/alpine_skiing.svg';
import AmericanFootballIcon from '../../assets/icons/categories/american_football.svg';
import ArcheryIcon from '../../assets/icons/categories/archery.svg';
import AthleticsIcon from '../../assets/icons/categories/athletics.svg';
import BadmintonIcon from '../../assets/icons/categories/badminton.svg';
import BaseballIcon from '../../assets/icons/categories/baseball.svg';
import BasketballIcon from '../../assets/icons/categories/basketball.svg';
import BeachsoccerIcon from '../../assets/icons/categories/beachsoccer.svg';
import BeachHandballIcon from '../../assets/icons/categories/beach_handball.svg';
import BeachVolleyballIcon from '../../assets/icons/categories/beach_volleyball.svg';
import BilliardIcon from '../../assets/icons/categories/billiard.svg';
import BilliardsIcon from '../../assets/icons/categories/billiards.svg';
import BMXIcon from '../../assets/icons/categories/bmx.svg';
import BoardGameIcon from '../../assets/icons/categories/board_game.svg';
import BoulesIcon from '../../assets/icons/categories/boules.svg';
import BowlingIcon from '../../assets/icons/categories/bowling.svg';
import BoxingIcon from '../../assets/icons/categories/boxing.svg';
import CalisthenicsIcon from '../../assets/icons/categories/calisthenics.svg';
import CanoeIcon from '../../assets/icons/categories/canoe.svg';
import ChessIcon from '../../assets/icons/categories/chess.svg';
import CricketIcon from '../../assets/icons/categories/cricket.svg';
import CrossfitIcon from '../../assets/icons/categories/crossfit.svg';
import CurlingIcon from '../../assets/icons/categories/curling.svg';
import DartsIcon from '../../assets/icons/categories/darts.svg';
import DodgeballIcon from '../../assets/icons/categories/dodgeball.svg';
import FencingIcon from '../../assets/icons/categories/fencing.svg';
import FieldHockeyIcon from '../../assets/icons/categories/field_hockey.svg';
import FistballIcon from '../../assets/icons/categories/fistball.svg';
import FitnessIcon from '../../assets/icons/categories/fitness.svg';
import FloorballIcon from '../../assets/icons/categories/floorball.svg';
import FunnelBallIcon from '../../assets/icons/categories/funnel_ball.svg';
import FutsalIcon from '../../assets/icons/categories/futsal.svg';
import GolfIcon from '../../assets/icons/categories/golf.svg';
import HandballIcon from '../../assets/icons/categories/handball.svg';
import HockeyIcon from '../../assets/icons/categories/hockey.svg';
import IceHockeyIcon from '../../assets/icons/categories/ice_hockey.svg';
import IceSkatingIcon from '../../assets/icons/categories/ice_skating.svg';
import KickScooterIcon from '../../assets/icons/categories/kick_scooter.svg';
import LaserTagIcon from '../../assets/icons/categories/laser_tag.svg';
import MiniatureGolfIcon from '../../assets/icons/categories/miniature_golf.svg';
import MountainBikingIcon from '../../assets/icons/categories/mountain_biking.svg';
import NetballIcon from '../../assets/icons/categories/netball.svg';
import PadelIcon from '../../assets/icons/categories/padel.svg';
import PaintballIcon from '../../assets/icons/categories/paintball.svg';
import PannaIcon from '../../assets/icons/categories/panna.svg';
import PlayingAdventureIcon from '../../assets/icons/categories/playing_adventure.svg';
import PlayingAirSportsIcon from '../../assets/icons/categories/playing_air_sports.svg';
import PlayingBaseballIcon from '../../assets/icons/categories/playing_baseball.svg';
import PlayingBasketballIcon from '../../assets/icons/categories/playing_basketball.svg';
import PlayingBoardGamesIcon from '../../assets/icons/categories/playing_board_games.svg';
import PlayingBowlingBilliardsIcon from '../../assets/icons/categories/playing_bowling_billiards.svg';
import PlayingCombatIcon from '../../assets/icons/categories/playing_combat.svg';
import PlayingCyclingIcon from '../../assets/icons/categories/playing_cycling.svg';
import PlayingFootballIcon from '../../assets/icons/categories/playing_football.svg';
import PlayingGolfIcon from '../../assets/icons/categories/playing_golf.svg';
import PlayingGymnasticsIcon from '../../assets/icons/categories/playing_gymnastics.svg';
import PlayingHandballIcon from '../../assets/icons/categories/playing_handball.svg';
import PlayingHockeyIcon from '../../assets/icons/categories/playing_hockey.svg';
import PlayingHorseRidingIcon from '../../assets/icons/categories/playing_horse_riding.svg';
import PlayingMotorSportsIcon from '../../assets/icons/categories/playing_motor_sports.svg';
import PlayingRugbyIcon from '../../assets/icons/categories/playing_rugby.svg';
import PlayingRunningIcon from '../../assets/icons/categories/playing_running.svg';
import PlayingSailingIcon from '../../assets/icons/categories/playing_sailing.svg';
import PlayingShootingIcon from '../../assets/icons/categories/playing_shooting.svg';
import PlayingSkatingIcon from '../../assets/icons/categories/playing_skating.svg';
import PlayingSkiingIcon from '../../assets/icons/categories/playing_skiing.svg';
import PlayingStrengthIcon from '../../assets/icons/categories/playing_strength_fitness.svg';
import PlayingSwimmingIcon from '../../assets/icons/categories/playing_swimming.svg';
import PlayingTennisIcon from '../../assets/icons/categories/playing_tennis.svg';
import PlayingVolleyballIcon from '../../assets/icons/categories/playing_volleyball.svg';
import RacquetballIcon from '../../assets/icons/categories/racquetball.svg';
import RoadCyclingIcon from '../../assets/icons/categories/road_cycling.svg';
import RollerHockeyIcon from '../../assets/icons/categories/roller_hockey.svg';
import RollerSkatingIcon from '../../assets/icons/categories/roller_skating.svg';
import RugbyIcon from '../../assets/icons/categories/rugby.svg';
import RunningIcon from '../../assets/icons/categories/running.svg';
import SailingIcon from '../../assets/icons/categories/sailing.svg';
import ShootingIcon from '../../assets/icons/categories/shooting.svg';
import SimpleSquareIcon from '../../assets/icons/categories/simple_square.svg';
import SkateboardIcon from '../../assets/icons/categories/skateboard.svg';
import SoccerIcon from '../../assets/icons/categories/soccer.svg';
import SoftballIcon from '../../assets/icons/categories/softball.svg';
import SportsWalkIcon from '../../assets/icons/categories/sports_walk.svg';
import SquashIcon from '../../assets/icons/categories/squash.svg';
import StreetballIcon from '../../assets/icons/categories/streetball.svg';
import SwimmingIcon from '../../assets/icons/categories/swimming.svg';
import TableTennisIcon from '../../assets/icons/categories/table_tennis.svg';
import TennisIcon from '../../assets/icons/categories/tennis.svg';
import TeqballIcon from '../../assets/icons/categories/teqball.svg';
import VolleyballIcon from '../../assets/icons/categories/volleyball.svg';
import WeightliftingIcon from '../../assets/icons/categories/weightlifting.svg';
import YogaIcon from '../../assets/icons/categories/yoga.svg';

/**
 * Centralny system mapowania ikon sportów
 * Wszystkie komponenty w aplikacji powinny korzystać z tego pliku
 * zamiast tworzyć własne systemy importów ikon
 */
export const SPORT_ICON_MAP: Record<string, React.FC<any>> = {
  // Playing sports (główne kategorie sportowe)
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
  playing_horse_riding: PlayingHorseRidingIcon,
  playing_strength_fitness: PlayingStrengthIcon,

  // Konkretne sporty (podkategorie)
  // Piłka nożna i warianty
  soccer: SoccerIcon,
  football: SoccerIcon, // Alias dla soccer
  futsal: FutsalIcon,
  beachsoccer: BeachsoccerIcon,
  beach_soccer: BeachsoccerIcon,
  'beach soccer': BeachsoccerIcon,
  
  // Sporty zespołowe
  basketball: BasketballIcon,
  volleyball: VolleyballIcon,
  handball: HandballIcon,
  beach_volleyball: BeachVolleyballIcon,
  'beach volleyball': BeachVolleyballIcon,
  beachvolleyball: BeachVolleyballIcon,
  beach_handball: BeachHandballIcon,
  'beach handball': BeachHandballIcon,
  
  // Sporty z rakietą
  tennis: TennisIcon,
  table_tennis: TableTennisIcon,
  'table tennis': TableTennisIcon,
  badminton: BadmintonIcon,
  squash: SquashIcon,
  padel: PadelIcon,
  racquetball: RacquetballIcon,
  
  // Hockey i warianty
  hockey: HockeyIcon,
  ice_hockey: IceHockeyIcon,
  'ice hockey': IceHockeyIcon,
  field_hockey: FieldHockeyIcon,
  'field hockey': FieldHockeyIcon,
  roller_hockey: RollerHockeyIcon,
  'roller hockey': RollerHockeyIcon,
  floorball: FloorballIcon,
  
  // Baseball i warianty
  baseball: BaseballIcon,
  softball: SoftballIcon,
  cricket: CricketIcon,
  
  // American football i rugby
  american_football: AmericanFootballIcon,
  'american football': AmericanFootballIcon,
  rugby: RugbyIcon,
  
  // Fitness i siła
  fitness: FitnessIcon,
  weightlifting: WeightliftingIcon,
  crossfit: CrossfitIcon,
  calisthenics: CalisthenicsIcon,
  yoga: YogaIcon,
  
  // Sporty biegowe i chód
  running: RunningIcon,
  athletics: AthleticsIcon,
  sports_walk: SportsWalkIcon,
  'sports walk': SportsWalkIcon,
  
  // Sporty na łyżwach i rolkach
  ice_skating: IceSkatingIcon,
  'ice skating': IceSkatingIcon,
  roller_skating: RollerSkatingIcon,
  'roller skating': RollerSkatingIcon,
  skateboard: SkateboardIcon,
  
  // Sporty rowerowe
  road_cycling: RoadCyclingIcon,
  'road cycling': RoadCyclingIcon,
  mountain_biking: MountainBikingIcon,
  'mountain biking': MountainBikingIcon,
  bmx: BMXIcon,
  kick_scooter: KickScooterIcon,
  'kick scooter': KickScooterIcon,
  
  // Golf i warianty
  golf: GolfIcon,
  miniature_golf: MiniatureGolfIcon,
  'miniature golf': MiniatureGolfIcon,
  
  // Sporty strzeleckie
  archery: ArcheryIcon,
  shooting: ShootingIcon,
  darts: DartsIcon,
  
  // Sporty walki
  boxing: BoxingIcon,
  fencing: FencingIcon,
  
  // Sporty wodne
  swimming: SwimmingIcon,
  sailing: SailingIcon,
  canoe: CanoeIcon,
  
  // Sporty zimowe
  alpine_skiing: AlpineSkiingIcon,
  'alpine skiing': AlpineSkiingIcon,
  curling: CurlingIcon,
  
  // Gry planszowe i umysłowe
  chess: ChessIcon,
  board_game: BoardGameIcon,
  'board game': BoardGameIcon,
  
  // Kręgle i bilard
  bowling: BowlingIcon,
  billiards: BilliardsIcon,
  billiard: BilliardIcon,
  boules: BoulesIcon,
  
  // Inne sporty zespołowe
  dodgeball: DodgeballIcon,
  netball: NetballIcon,
  fistball: FistballIcon,
  funnel_ball: FunnelBallIcon,
  'funnel ball': FunnelBallIcon,
  teqball: TeqballIcon,
  
  // Warianty piłki nożnej
  streetball: StreetballIcon,
  panna: PannaIcon,
  
  // Sporty militarne/taktyczne  
  airsoft: AirsoftIcon,
  paintball: PaintballIcon,
  laser_tag: LaserTagIcon,
  'laser tag': LaserTagIcon,
  
  // Fallback
  simple_square: SimpleSquareIcon,
  default: SimpleSquareIcon,
};

/**
 * Pobiera komponent ikony dla danego sportu
 * @param iconName - nazwa ikony (może pochodzić z bazy danych lub API)
 * @param sportName - nazwa sportu (fallback jeśli iconName nie zostanie znaleziony)
 * @returns komponent ikony lub fallback
 */
export const getSportIcon = (iconName?: string, sportName?: string): React.FC<any> => {
  // Najpierw próbuj znaleźć po iconName
  if (iconName && SPORT_ICON_MAP[iconName]) {
    return SPORT_ICON_MAP[iconName];
  }
  
  // Potem próbuj po sportName (różne warianty)
  if (sportName) {
    const sportKey = sportName.toLowerCase().trim();
    
    // Dokładne dopasowanie
    if (SPORT_ICON_MAP[sportKey]) {
      return SPORT_ICON_MAP[sportKey];
    }
    
    // Ze spacjami zamienionymi na podkreślenia
    const sportKeyUnderscored = sportKey.replace(/\s+/g, '_');
    if (SPORT_ICON_MAP[sportKeyUnderscored]) {
      return SPORT_ICON_MAP[sportKeyUnderscored];
    }
    
    // Z podkreśleniami zamienionymi na spacje
    const sportKeySpaced = sportKey.replace(/_/g, ' ');
    if (SPORT_ICON_MAP[sportKeySpaced]) {
      return SPORT_ICON_MAP[sportKeySpaced];
    }
  }
  
  // Fallback na domyślną ikonę
  return SPORT_ICON_MAP.simple_square;
};

/**
 * Pobiera listę ikon dla listy sportów z ograniczeniem ilości
 * @param sports - lista sportów
 * @param maxIcons - maksymalna liczba ikon do zwrócenia (domyślnie 4)
 * @returns tablica obiektów z ikonami sportów
 */
export const getSportIcons = (
  sports: { id: string | number; name: string; iconName?: string }[], 
  maxIcons: number = 4
) => {
  return sports
    .slice(0, maxIcons)
    .map(sport => {
      const IconComponent = getSportIcon(sport.iconName, sport.name);
      return {
        id: sport.id,
        name: sport.name,
        IconComponent
      };
    });
};

/**
 * Lista wszystkich dostępnych kluczy ikon dla debugowania/rozwoju
 */
export const AVAILABLE_ICON_KEYS = Object.keys(SPORT_ICON_MAP);

export default SPORT_ICON_MAP;