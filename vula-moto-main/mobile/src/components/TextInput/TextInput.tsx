import { COLORS, FONTS } from "@/src/constants";
import React from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  TextStyle,
  TextInput as Ti,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  containerStyles: StyleProp<ViewStyle>;
  outerContainerStyles: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  errorStyle: StyleProp<TextStyle>;
  inputStyle: StyleProp<TextStyle>;
  placeholder: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  keyboardType: KeyboardTypeOptions;
  text: string;
  onChangeText: (text: string) => void;
  secureTextEntry: boolean;
  editable: boolean;
  onSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  onRightIconPress: () => void;
  numberOfLines: number;
  multiline: boolean;
  label: string;
  error: string;
  onFocus?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
}

const AnimatedTextInput = Animated.createAnimatedComponent(Ti);
const TextInput: React.FunctionComponent<Partial<Props>> = ({
  placeholder,
  containerStyles,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  keyboardType,
  text,
  onChangeText,
  editable,
  onSubmitEditing,
  secureTextEntry,
  onRightIconPress,
  multiline,
  numberOfLines,
  label,
  error,
  errorStyle,
  outerContainerStyles,
  onFocus,
}) => {
  const focused = useSharedValue(0);
  const animatedTextInputStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      focused.value,
      [0, 1],
      [COLORS.gray100, "#f5f5f5"]
    );
    return {
      backgroundColor,
    };
  });

  const onTextInputFocus = () => {
    focused.value = withTiming(1, { duration: 400 });
  };
  const onTextInputBlur = () => {
    focused.value = withTiming(0, { duration: 400 });
  };
  return (
    <View style={[{ borderRadius: 5 }, outerContainerStyles]}>
      {label ? (
        <Text
          style={[
            {
              fontFamily: FONTS.bold,
              color: COLORS.black,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          {
            flexDirection: "row",
            width: "100%",
            backgroundColor: COLORS.gray100,
            borderRadius: 5,
            padding: 5,
            alignItems: "center",
            borderWidth: 2,
            borderColor: !!error ? "red" : "#f5f5f5",
          },
          containerStyles,
        ]}
      >
        {!!leftIcon ? <View style={{ marginRight: 5 }}>{leftIcon}</View> : null}
        <AnimatedTextInput
          placeholder={placeholder}
          style={[
            {
              flex: 1,
              backgroundColor: "white",
              marginHorizontal: 0,
              borderRadius: 5,
              fontFamily: FONTS.regular,
              fontSize: 18,
              paddingVertical: 5,
              paddingHorizontal: 10,
            },
            inputStyle,
            animatedTextInputStyle,
          ]}
          keyboardType={keyboardType}
          value={text}
          onChangeText={onChangeText}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secureTextEntry}
          numberOfLines={numberOfLines}
          multiline={multiline}
          onBlur={onTextInputBlur}
          onFocus={(e) => {
            if (typeof onFocus !== "undefined") {
              onFocus(e);
            }
            onTextInputFocus();
          }}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity
          style={{ marginLeft: 5 }}
          activeOpacity={0.7}
          onPress={onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      </View>
      {!!error ? <Text style={errorStyle}>{error}</Text> : null}
    </View>
  );
};

export default TextInput;
