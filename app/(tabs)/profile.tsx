import "../../global.css";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-text-primary font-inter">
        Profile Screen
      </Text>
      <Text className="text-text-secondary font-inter mt-2">
        Twój profil gracza
      </Text>
    </View>
  );
}