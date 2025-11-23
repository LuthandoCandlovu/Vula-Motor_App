import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const HeaderBackButton = ({
  title,
  onBackButtonPress,
}: {
  title: string;
  onBackButtonPress?: () => void;
}) => {
  const navigation = useNavigation();
  const { settings } = useSettingsStore();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={async () => {
        if (settings.haptics) {
          await onImpact();
        }
        if (typeof onBackButtonPress !== "undefined") {
          onBackButtonPress();
        } else {
          navigation.goBack();
        }
      }}
    >
      <Ionicons name="arrow-back" size={24} color={COLORS.white} />
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: COLORS.white,
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default HeaderBackButton;
