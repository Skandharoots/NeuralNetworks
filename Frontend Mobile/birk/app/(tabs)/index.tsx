import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1 gap-8 bg-background-light dark:bg-background-dark">
        <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
          <Text className="text-5xl font-bold text-account-main dark:text-account-dark">Welcome</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
