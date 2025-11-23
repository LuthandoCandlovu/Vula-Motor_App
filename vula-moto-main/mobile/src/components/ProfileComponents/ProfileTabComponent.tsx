import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { TTab } from "@/src/types";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const ProfileTabComponent = ({
  tabs,
  setActiveTab,
}: {
  tabs:
    | TTab<"read" | "unread" | "all">[]
    | TTab<"services" | "spares" | "wishlist">[];
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { settings } = useSettingsStore();
  const activeIndex = useSharedValue(0);
  const handleTabPress = async (index: number) => {
    if (settings.haptics) {
      await onImpact();
    }
    setActiveTab(index);
    activeIndex.value = index;
  };

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab, index) => {
        const animatedTabStyle = useAnimatedStyle(() => {
          return {
            backgroundColor: withTiming(
              activeIndex.value === index ? COLORS.secondary : COLORS.gray100,
              { duration: 300 }
            ),
          };
        });

        const animatedColorStyle = useAnimatedStyle(() => {
          return {
            color: withTiming(
              activeIndex.value === index ? COLORS.white : COLORS.black,
              {
                duration: 300,
              }
            ),
          };
        });

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(index)}
            style={{ flex: 1 }}
          >
            <Animated.View style={[styles.tabButton, animatedTabStyle]}>
              <AnimatedIonicons
                size={18}
                name={tab.icon as any}
                style={animatedColorStyle}
              />
              <Animated.Text style={[styles.tabText, animatedColorStyle]}>
                {tab.name}
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.memo(ProfileTabComponent);
const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
