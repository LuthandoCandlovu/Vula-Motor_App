import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS } from "../../constants";

interface Props {
  placeholder: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onSearchButtonPress?: () => void;
  onCancelButtonPress?: () => void;
}
const SearchBar = ({
  placeholder,
  query,
  setQuery,
  onCancelButtonPress,
  onSearchButtonPress,
}: Props) => {
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    focused: false,
  });

  const textInputRef = React.useRef<TextInput>(null);
  const focused = useSharedValue(0);
  const animatedTextInputStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      focused.value,
      [0, 1],
      [COLORS.gray100, COLORS.main]
    );
    return {
      backgroundColor,
    };
  });

  const onFocus = () => {
    focused.value = withTiming(1, { duration: 400 });
  };
  const onBlur = () => {
    focused.value = withTiming(0, { duration: 400 });
  };

  return (
    <View
      style={{
        height: 60,
        width: "100%",
        maxWidth: 450,
        paddingVertical: 10,
        paddingHorizontal: 20,
        minHeight: 60,
      }}
    >
      <Animated.View
        style={[
          animatedTextInputStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderRadius: 10,
            gap: 10,
            minHeight: 50,
            maxHeight: 50,
            paddingHorizontal: 20,
            elevation: 5,
            marginVertical: 5,
            shadowColor: COLORS.gray,
            shadowOffset: { width: 2, height: 2 },
            shadowRadius: 5,
            shadowOpacity: 1,
            flex: 1,
          },
        ]}
      >
        <TouchableOpacity
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }

            setState((s) => ({ ...s, focused: false }));
            setQuery("");
            if (typeof onCancelButtonPress !== "undefined") {
              onCancelButtonPress();
            }
            textInputRef.current?.blur();
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: query.trim().length === 0 ? 0 : 24,
          }}
        >
          <Ionicons name="close-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <TextInput
          style={{
            flex: 1,
            fontFamily: FONTS.bold,
            fontSize: 18,
            backgroundColor: COLORS.transparent,
            paddingHorizontal: 10,
          }}
          placeholderTextColor={COLORS.black}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={textInputRef}
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
        <TouchableOpacity
          disabled={query.trim().length === 0}
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: query.trim().length === 0 ? 0 : 24,
          }}
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            if (typeof onSearchButtonPress !== "undefined") {
              onSearchButtonPress();
            }
          }}
        >
          <Ionicons name="search-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SearchBar;
