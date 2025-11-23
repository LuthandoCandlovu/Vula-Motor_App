import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";

const Page = () => {
  const router = useRouter();
  const { settings, update } = useSettingsStore();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Notification Settings",
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
      <View style={{ flex: 1, backgroundColor: COLORS.main, padding: 10 }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          General Notification
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
              maxWidth: 500,
              alignSelf: "flex-start",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 10,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    messages: !settings.notifications.messages,
                  },
                });
              }}
            >
              <MaterialCommunityIcons
                name={
                  settings.notifications.messages
                    ? "message-outline"
                    : "message-off-outline"
                }
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Messages
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.notifications.messages ? "ONN" : "OFF"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    vulamoto: !settings.notifications.vulamoto,
                  },
                });
              }}
            >
              <MaterialCommunityIcons
                name={
                  settings.notifications.vulamoto
                    ? "briefcase-outline"
                    : "briefcase-off-outline"
                }
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Vula Moto Notifications
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.notifications.vulamoto ? "ONN" : "OFF"}
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
