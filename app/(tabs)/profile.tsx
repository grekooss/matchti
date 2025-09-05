import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Profile Screen
      </Text>
      <Text style={styles.subtitle}>
        Twój profil gracza
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    // Padding dla reklamy Google jest już uwzględniony w _layout.tsx
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    fontFamily: 'Inter',
  },
  subtitle: {
    color: '#718096',
    fontFamily: 'Inter',
    marginTop: 8,
  },
});