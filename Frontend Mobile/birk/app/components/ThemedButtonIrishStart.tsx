import { Pressable, Text } from "react-native";


const ThemedButtonIrishStart = ({ title, icon, onPress }: any) => {
    return (
        <Pressable onPress={onPress} className="w-['95%'] flex-row text-center items-center justify-center bg-irish-main hover:bg-irish-light text-text-dark rounded-2xl p-2">
            <Text className="text-xl align-middle text-text-dark">{icon}</Text>
            <Text className="text-text-dark leading-none text-lg leading-8 items-center justify-center text-center">{title}  </Text>
        </Pressable>
    );
}

export default ThemedButtonIrishStart;