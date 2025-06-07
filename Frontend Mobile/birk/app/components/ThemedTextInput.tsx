import { Appearance, TextInput } from "react-native";


const ThemedTextInput = ({ ...props }) => {
    return (
        <TextInput placeholderTextColor={Appearance.getColorScheme() === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'} className="w-['100%'] text text-text-light text-left dark:text-text-dark rounded-2xl border-b border-text-light dark:border-text-dark p-4 mb-4" {...props}/>
    );
}

export default ThemedTextInput;