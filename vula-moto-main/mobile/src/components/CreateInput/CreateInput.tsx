import { COLORS, FONTS } from "@/src/constants";

import {
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  AnimatedStyle,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CreateInputProps {
  label: string;
  placeholder?: string;
  Icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  onIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
  inputContainerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  inputStyle?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
}

const CreateInput: React.FC<CreateInputProps> = ({
  label,
  placeholder,
  Icon,
  onChangeText,
  value,
  containerStyle,
  onIconPress,
  multiline,
  inputContainerStyle,
  inputStyle,
  keyboardType,
  iconStyle,
  editable,
}) => {
  const focused = useSharedValue(0);
  const animatedTextInputStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      focused.value,
      [0, 1],
      [COLORS.gray100, COLORS.gray200]
    );
    return {
      backgroundColor: bg,
    };
  });
  return (
    <View style={[{ width: "100%" }, containerStyle]}>
      <Text style={{ fontFamily: FONTS.bold }}>{label}</Text>
      <Animated.View
        style={[
          animatedTextInputStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderRadius: 5,
            padding: 10,
          },
          inputContainerStyle,
        ]}
      >
        <TouchableOpacity
          style={[iconStyle]}
          onPress={() => {
            if (typeof onIconPress !== "undefined") {
              onIconPress();
            }
          }}
        >
          {Icon}
        </TouchableOpacity>
        <TextInput
          placeholder={placeholder}
          style={[
            {
              flex: 1,
              minWidth: 40,
              fontFamily: FONTS.bold,
              paddingVertical: Platform.select({
                ios: 6,
                default: 0,
              }),
              fontSize: 16,
            },
            inputStyle,
          ]}
          onFocus={() => (focused.value = withTiming(1, { duration: 400 }))}
          onBlur={() => (focused.value = withTiming(0, { duration: 400 }))}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.black}
          editable={editable}
        />
      </Animated.View>
    </View>
  );
};

export default CreateInput;
