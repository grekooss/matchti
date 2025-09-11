import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Feather,
} from '@expo/vector-icons';

// Import centralnego systemu zarządzania ikonami sportów
import { getSportIcon } from '@/lib/constants/sportIcons';
import ScreenHeader from '@/components/common/ScreenHeader';

// Mock dane użytkownika - w rzeczywistej aplikacji pochodziłyby z Supabase
const mockUser = {
  id: '1',
  name: 'Jan Kowalski',
  email: 'jan.kowalski@email.com',
  avatar: null,
  joinedDate: '2024-01-15',
  location: 'Warszawa, Polska',
  favoritesSports: ['soccer', 'basketball', 'tennis'],
  totalMatches: 47,
  level: 'Średniozaawansowany',
  verified: true,
  rating: 4.8,
  completedProfile: 85,
};


interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.menuContainer}>
      {children}
    </View>
  </View>
);

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
  isLast = false,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && styles.menuItemLast]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View style={styles.menuItemIconContainer}>{icon}</View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.menuItemRight}>
      {rightElement}
      {showArrow && (
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      )}
    </View>
  </TouchableOpacity>
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      {icon}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  // Oblicz dynamiczną wysokość nagłówka: insets.top + padding + marginTop + height nagłówka
  const headerHeight = insets.top + 4 + 4 + 60 

  const handleEditProfile = () => console.log('Edytuj profil');
  const handlePersonalInfo = () => console.log('Informacje osobiste');
  const handleNotifications = () => console.log('Powiadomienia');
  const handlePrivacySettings = () => console.log('Prywatność');
  const handleSportPreferences = () => console.log('Preferencje sportowe');
  const handleMyMatches = () => console.log('Moje mecze');
  const handleFavorites = () => console.log('Ulubione obiekty');
  const handleFriends = () => console.log('Znajomi');
  const handleSettings = () => console.log('Ustawienia');
  const handleHelp = () => console.log('Pomoc');
  const handleAbout = () => console.log('O aplikacji');
  const handleLogout = () => console.log('Wyloguj się');

  const renderFavoriteSports = () => {
    return mockUser.favoritesSports.slice(0, 3).map((sportKey, index) => {
      const IconComponent = getSportIcon(sportKey, sportKey);
      return (
        <View key={sportKey} style={styles.sportIconWrapper}>
          <IconComponent 
            width={20} 
            height={20} 
            fill="#069494"
            color="#069494"
            stroke="#069494"
          />
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title="Profil"
        subtitle="Zarządzaj swoim kontem"
        iconName="person"
      />
      <ScrollView style={[styles.scrollView, { paddingTop: headerHeight }]} showsVerticalScrollIndicator={false}>
        {/* Header z awatarem */}
        <View style={styles.header}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {mockUser.avatar ? (
                <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={handleEditProfile}>
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{mockUser.name}</Text>
                {mockUser.verified && (
                  <MaterialIcons name="verified" size={16} color="#069494" />
                )}
              </View>
              <Text style={styles.userEmail}>{mockUser.email}</Text>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={12} color="#6B7280" />
                <Text style={styles.userLocation}>{mockUser.location}</Text>
              </View>

              <View style={styles.favoritesSportsContainer}>
                <Text style={styles.favoritesSportsLabel}>Ulubione sporty:</Text>
                <View style={styles.sportsIconsRow}>
                  {renderFavoriteSports()}
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Feather name="edit-2" size={14} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edytuj profil</Text>
            </TouchableOpacity>
          </View>

          {/* Kompletność profilu */}
          <View style={styles.profileCompletion}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>Kompletność profilu</Text>
              <Text style={styles.completionPercent}>{mockUser.completedProfile}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${mockUser.completedProfile}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Statystyki w kartach */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Rozegrane mecze"
            value={mockUser.totalMatches}
            icon={<Ionicons name="trophy" size={20} color="#069494" />}
          />
          <StatCard
            label="Ocena"
            value={mockUser.rating}
            icon={<Ionicons name="star" size={20} color="#069494" />}
          />
          <StatCard
            label="Poziom"
            value={mockUser.level.split(' ')[0]} // Skrócona wersja
            icon={<Ionicons name="trending-up" size={20} color="#069494" />}
          />
        </View>

        {/* Menu główne */}
        <MenuSection title="Konto">
          <MenuItem
            icon={<Ionicons name="person-outline" size={20} color="#069494" />}
            title="Informacje osobiste"
            subtitle="Edytuj dane kontaktowe"
            onPress={handlePersonalInfo}
          />
          <MenuItem
            icon={<Ionicons name="notifications-outline" size={20} color="#069494" />}
            title="Powiadomienia"
            subtitle="Mecze, wiadomości"
            onPress={handleNotifications}
          />
          <MenuItem
            icon={<Ionicons name="shield-outline" size={20} color="#069494" />}
            title="Prywatność"
            subtitle="Bezpieczeństwo konta"
            onPress={handlePrivacySettings}
            isLast={true}
          />
        </MenuSection>

        {/* Sport */}
        <MenuSection title="Sport">
          <MenuItem
            icon={
              (() => {
                const SoccerIconComponent = getSportIcon('soccer', 'soccer');
                return <SoccerIconComponent width={20} height={20} color="#069494" stroke="#069494" />;
              })()
            }
            title="Preferencje sportowe"
            subtitle="Ulubione sporty i poziom"
            onPress={handleSportPreferences}
          />
          <MenuItem
            icon={<Ionicons name="trophy-outline" size={20} color="#069494" />}
            title="Moje mecze"
            subtitle="Historia i statystyki"
            onPress={handleMyMatches}
          />
          <MenuItem
            icon={<AntDesign name="heart" size={18} color="#069494" />}
            title="Ulubione obiekty"
            subtitle="Zapisane miejsca"
            onPress={handleFavorites}
            isLast={true}
          />
        </MenuSection>

        {/* Społeczność */}
        <MenuSection title="Społeczność">
          <MenuItem
            icon={<Ionicons name="people-outline" size={20} color="#069494" />}
            title="Znajomi"
            subtitle="Dodaj i zarządzaj kontaktami"
            onPress={handleFriends}
            isLast={true}
          />
        </MenuSection>

        {/* Ustawienia */}
        <MenuSection title="Aplikacja">
          <MenuItem
            icon={<Ionicons name="settings-outline" size={20} color="#069494" />}
            title="Ustawienia"
            subtitle="Język, powiadomienia"
            onPress={handleSettings}
          />
          <MenuItem
            icon={<Ionicons name="help-circle-outline" size={20} color="#069494" />}
            title="Pomoc i wsparcie"
            subtitle="FAQ, kontakt"
            onPress={handleHelp}
          />
          <MenuItem
            icon={<Ionicons name="information-circle-outline" size={20} color="#069494" />}
            title="O aplikacji"
            subtitle="Wersja 1.0.0"
            onPress={handleAbout}
            isLast={true}
          />
        </MenuSection>

        {/* Wylogowanie */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Wyloguj się</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding dla tab bar i reklamy */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    // paddingTop jest teraz dynamiczny - ustawiony w komponencie
  },
  header: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#069494',
  },
  defaultAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#069494',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#047857',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#069494',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginRight: 6,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userLocation: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginLeft: 4,
  },
  favoritesSportsContainer: {
    alignItems: 'center',
  },
  favoritesSportsLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginBottom: 6,
  },
  sportsIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sportIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#069494',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  profileCompletion: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  completionPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#069494',
    fontFamily: 'Inter',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#069494',
    borderRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#069494',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 8,
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutSection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
    fontFamily: 'Inter',
    marginLeft: 6,
  },
  bottomPadding: {
    height: 160, // Zwiększony padding dla tab bar i reklamy - lepsze przewijanie
  },
});