import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ItemsCategoryBottomSheet from "../BottomSheets/ItemsCategoryBottomSheet";

const HomeHeader = ({
  category,
  setCategory,
}: BottomTabHeaderProps & {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { settings } = useSettingsStore();
  const { top } = useSafeAreaInsets();
  const unread = 4;
  const router = useRouter();
  const itemsCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null);

  return (
    <>
      <ItemsCategoryBottomSheet
        category={category}
        setCategory={setCategory}
        ref={itemsCategoryBottomSheetRef}
      />
      <SafeAreaView style={{ backgroundColor: COLORS.tertiary }}>
        <View
          style={{
            paddingTop: Platform.select({ ios: 0, android: top + 10 }),
            paddingBottom: 14,
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
              Automotive
            </Text>
            <View
              style={{ gap: 10, flexDirection: "row", alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  //   router.push("/(stacks)/notifications");
                }}
                hitSlop={20}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  backgroundColor: COLORS.main,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {unread ? (
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      backgroundColor: COLORS.red,
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  ></View>
                ) : null}
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              maxHeight: 80,
              maxWidth: 400,
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                // router.navigate("/(stacks)/search");
              }}
            >
              <Text style={styles.btn_txt}>Search</Text>
              <Ionicons name="search-outline" size={18} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                itemsCategoryBottomSheetRef.current?.present();
              }}
            >
              <Text style={styles.btn_txt}>Categories</Text>
              <Ionicons name="list-outline" size={18} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    flexDirection: "row-reverse",
    gap: 10,
    flex: 1,
    paddingVertical: 5,
    borderRadius: 999,
    maxWidth: 200,
  },
  btn_txt: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.black,
  },
});
