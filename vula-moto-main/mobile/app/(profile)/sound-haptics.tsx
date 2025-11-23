import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";

const Page = () => {
  const router = useRouter();
  const { settings, update } = useSettingsStore();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Sound and Haptics",
          headerLargeTitle: false,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ),

          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold, color: COLORS.white },
          headerStyle: { backgroundColor: COLORS.tertiary },
        }}
      />
      <View style={{ flex: 1, padding: 10, backgroundColor: COLORS.main }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Haptics
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
              maxWidth: 400,
              alignSelf: "flex-start",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({ ...settings, haptics: !settings.haptics });
              }}
            >
              <MaterialCommunityIcons
                name={settings.haptics ? "vibrate" : "vibrate-off"}
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Haptics
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 14,
                    marginTop: Platform.select({
                      android: -5,
                    }),
                  }}
                >
                  {settings.haptics ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Sound
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              maxWidth: 400,
              alignSelf: "flex-start",
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({ ...settings, sound: !settings.sound });
              }}
            >
              <Ionicons
                name={
                  settings.sound ? "volume-high-outline" : "volume-mute-outline"
                }
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Sound
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 14,
                    marginTop: Platform.select({
                      android: -5,
                    }),
                  }}
                >
                  {settings.sound ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </View>
    </>
  );
};

export default Page;
