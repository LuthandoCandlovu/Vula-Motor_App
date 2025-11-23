import ItemForm from "@/src/components/Forms/ItemForm";

import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";

const Page = () => {
  const { category } = useLocalSearchParams<{
    category: "services" | "spares";
  }>();
  const { settings } = useSettingsStore();
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: `Publish ${category}`,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/create");
                }
              }}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          ),
          headerLargeTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 25,
          },
          headerTitleStyle: { fontFamily: FONTS.bold, color: COLORS.white },
          headerStyle: { backgroundColor: COLORS.tertiary },
        }}
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          padding: 10,
          paddingTop: Platform.select({ ios: 150, android: 10 }),
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ItemForm category={category} />
      </ScrollView>
    </>
  );
};

export default Page;
