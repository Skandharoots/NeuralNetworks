import { Pressable, Text } from "react-native";


const ThemedButtonWhiteOutline = ({ title, icon, onPress }) => {
  return (
    <Pressable onPress={onPress} className="w-['95%'] text-center flex-row items-center justify-center border border-text-light dark:border-text-dark text-text-light dark:text-text-dark rounded-2xl p-2">
      <Text className="text-text-light dark:text-text-dark leading-none text-lg leading-8 items-center justify-center text-center">{title}  </Text>
      <Text className="text-lg align-middle text-text-light dark:text-text-dark">{icon}</Text>
    </Pressable>
  );
}

export default ThemedButtonWhiteOutline;