import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import EditProductForm from "@/src/components/Forms/EditProductForm";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";

const Page = () => {
  const { category, id } = useLocalSearchParams<{
    category: "services" | "spares";
    id: Id<"items">;
  }>();
  const { settings } = useSettingsStore();
  const product = useQuery(api.api.items.getItemById, {
    id,
  });
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: product?.title || `Edit ${category}`,
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
          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
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
        <EditProductForm product={product as any} category={category} />
      </ScrollView>
    </>
  );
};

export default Page;
