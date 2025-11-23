import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { TTab } from "@/src/types";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WishlistOptionsBottomSheet from "../BottomSheets/WishlistOptionsBottomSheet";
import ProfileTabComponent from "../ProfileComponents/ProfileTabComponent";
const WishlistHeader = ({
  setActiveTab,
  tabs,
}: BottomTabHeaderProps & {
  tabs: TTab<"spares" | "services" | "wishlist">[];
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { settings } = useSettingsStore();
  const { top } = useSafeAreaInsets();
  const wishlistOptionsBottomSheetRef = React.useRef<BottomSheetModal>(null);
  return (
    <>
      <WishlistOptionsBottomSheet ref={wishlistOptionsBottomSheetRef} />
      <SafeAreaView style={{ backgroundColor: COLORS.tertiary }}>
        <View
          style={{
            paddingTop: Platform.select({ ios: 0, android: top + 20 }),
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: COLORS.main,
            backgroundColor: COLORS.tertiary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 25,
                textAlign: "center",
                color: COLORS.white,
              }}
            >
              Your Wishlist
            </Text>
            <TouchableOpacity
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                wishlistOptionsBottomSheetRef.current?.present();
              }}
              hitSlop={20}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: COLORS.gray100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="ellipsis-vertical-outline"
                size={25}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              width: "100%",
              maxWidth: 300,
              alignSelf: "center",
              paddingTop: 20,
              marginTop: Platform.select({ ios: 10 }),
            }}
            entering={SlideInRight.duration(400).delay(400)}
          >
            <ProfileTabComponent tabs={tabs} setActiveTab={setActiveTab} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default WishlistHeader;
