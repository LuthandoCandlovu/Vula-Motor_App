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
import ChatsOptionsBottomSheet from "../BottomSheets/ChatsOptionsBottomSheet";
import ProfileTabComponent from "../ProfileComponents/ProfileTabComponent";
import SearchBar from "../SearchBar/SearchBar";

const ChatsHeader = ({
  setActiveTab,
  tabs,
  query,
  setQuery,
  onSearchButtonPress,
}: BottomTabHeaderProps & {
  tabs: TTab<"read" | "unread" | "all">[];
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  onSearchButtonPress: () => void;
}) => {
  const { settings } = useSettingsStore();
  const { top } = useSafeAreaInsets();

  const chatsOptionsBottomSheetRef = React.useRef<BottomSheetModal>(null);
  return (
    <>
      <ChatsOptionsBottomSheet ref={chatsOptionsBottomSheetRef} />
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
              Chats
            </Text>
            <TouchableOpacity
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                chatsOptionsBottomSheetRef.current?.present();
              }}
              hitSlop={20}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="ellipsis-vertical-outline"
                size={25}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          <SearchBar
            setQuery={setQuery}
            query={query}
            placeholder={`Search Chats...`}
            onSearchButtonPress={onSearchButtonPress}
          />

          <Animated.View
            style={{
              width: "100%",
              maxWidth: 350,
              alignSelf: "center",
              paddingTop: 10,
              marginTop: Platform.select({ ios: 5, android: 0 }),
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

export default ChatsHeader;
