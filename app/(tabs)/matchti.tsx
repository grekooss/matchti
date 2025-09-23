import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthModalStore } from '@/lib/zustand/authModalStore';
import { useNavigationBarHiding } from '@/hooks/useNavigationBarHiding';

// Przykładowe spotkania użytkownika
const userMatches = [
  {
    id: "1",
    opponent: "Anna Kowalska",
    date: "2025-01-12",
    time: "18:00",
    court: "Kort tenisowy Rynek",
    status: "confirmed",
    sport: "Tenis"
  },
  {
    id: "2",
    opponent: "Piotr Nowak",
    date: "2025-01-15",
    time: "19:30",
    court: "Korty Błonia",
    status: "pending",
    sport: "Tenis"
  },
  {
    id: "3",
    opponent: "Maja Wiśniewska",
    date: "2025-01-18",
    time: "17:00",
    court: "Klub tenisowy Kazimierz",
    status: "confirmed",
    sport: "Tenis"
  }
];

export default function HomeScreen() {
  // Hook do automatycznego ukrywania paska nawigacyjnego
  useNavigationBarHiding();
  
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { showAuthModal } = useAuthModalStore();
  
  // Oblicz dynamiczną wysokość nagłówka: insets.top + padding + marginTop + height nagłówka
  const headerHeight = insets.top + 4 + 4 + 60;

  const handleLoginPress = () => {
    showAuthModal('signin');
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title="Twoje MatchTi"
        subtitle="Zarządzaj swoimi spotkaniami"
        useMatchtiIcon={true}
      />
      <ScrollView 
        style={[styles.scrollView, { paddingTop: headerHeight }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Kondycjonalny content w zależności od autoryzacji */}
        {!isAuthenticated ? (
          // Content dla niezalogowanego użytkownika
          <View style={styles.unauthenticatedContainer}>
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconContainer}>
                <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyStateTitle}>
                Zaloguj się, aby zacząć organizować spotkania
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Dostęp do tworzenia spotkań, zarządzania meczami i znajdowania partnerów wymaga zalogowania
              </Text>
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLoginPress}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  Zaloguj się
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Content dla zalogowanego użytkownika
          <>
            {/* Statystyki użytkownika */}
            <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={20} color="#069494" />
            </View>
            <Text style={styles.statValue}>{userMatches.length}</Text>
            <Text style={styles.statLabel}>Zaplanowane mecze</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#069494" />
            </View>
            <Text style={styles.statValue}>{userMatches.filter(m => m.status === 'confirmed').length}</Text>
            <Text style={styles.statLabel}>Potwierdzone</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={20} color="#069494" />
            </View>
            <Text style={styles.statValue}>{userMatches.filter(m => m.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Oczekujące</Text>
          </View>
        </View>

        {/* Sekcja nadchodzących spotkań */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nadchodzące mecze</Text>
          <View style={styles.menuContainer}>
            {userMatches.map((match, index) => (
              <TouchableOpacity
                key={match.id}
                style={[styles.matchItem, index === userMatches.length - 1 && styles.matchItemLast]}
                activeOpacity={0.7}
              >
                <View style={styles.matchItemLeft}>
                  <View style={styles.matchItemIconContainer}>
                    <Ionicons name="tennisball" size={20} color="#069494" />
                  </View>
                  <View style={styles.matchItemContent}>
                    <Text style={styles.matchItemTitle}>{match.opponent}</Text>
                    <Text style={styles.matchItemSubtitle}>
                      {new Date(match.date).toLocaleDateString('pl-PL', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} o {match.time}
                    </Text>
                    <Text style={styles.matchItemLocation}>{match.court}</Text>
                  </View>
                </View>
                <View style={styles.matchItemRight}>
                  <View style={[
                    styles.statusBadge,
                    match.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      match.status === 'confirmed' ? styles.confirmedText : styles.pendingText
                    ]}>
                      {match.status === 'confirmed' ? 'Potwierdzone' : 'Oczekuje'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Szybkie akcje */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Szybkie akcje</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
              <View style={styles.actionItemLeft}>
                <View style={styles.actionItemIconContainer}>
                  <Ionicons name="add-circle" size={20} color="#069494" />
                </View>
                <View style={styles.actionItemContent}>
                  <Text style={styles.actionItemTitle}>Umów nowy mecz</Text>
                  <Text style={styles.actionItemSubtitle}>Znajdź przeciwnika</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
              <View style={styles.actionItemLeft}>
                <View style={styles.actionItemIconContainer}>
                  <Ionicons name="location" size={20} color="#069494" />
                </View>
                <View style={styles.actionItemContent}>
                  <Text style={styles.actionItemTitle}>Znajdź korty</Text>
                  <Text style={styles.actionItemSubtitle}>Obiekty w pobliżu</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionItem, styles.actionItemLast]} activeOpacity={0.7}>
              <View style={styles.actionItemLeft}>
                <View style={styles.actionItemIconContainer}>
                  <Ionicons name="trophy" size={20} color="#069494" />
                </View>
                <View style={styles.actionItemContent}>
                  <Text style={styles.actionItemTitle}>Historia meczów</Text>
                  <Text style={styles.actionItemSubtitle}>Zobacz statystyki</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

            {/* Bottom padding dla tab bar i reklamy */}
            <View style={styles.bottomPadding} />
          </>
        )}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Jeszcze większy dodatkowy padding dla komfortowego przewijania
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
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  matchItemLast: {
    borderBottomWidth: 0,
  },
  matchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  matchItemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchItemContent: {
    flex: 1,
  },
  matchItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  matchItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  matchItemLocation: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  matchItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
  },
  confirmedText: {
    color: '#065F46',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  pendingText: {
    color: '#92400E',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  actionItemLast: {
    borderBottomWidth: 0,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionItemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionItemContent: {
    flex: 1,
  },
  actionItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  actionItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  bottomPadding: {
    height: 250, // Bardzo duży padding dla bardzo komfortowego przewijania
  },
  // Styles dla niezalogowanego użytkownika
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20, // Stały offset od nagłówka - zawsze w tym samym miejscu
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  loginButton: {
    backgroundColor: '#069494',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});