import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ProfileInfo from "@/src/components/ProfileComponents/ProfileInfo";
import ProfileUserCard from "@/src/components/ProfileComponents/ProfileUserCard";
import ProfileUserProducts from "@/src/components/ProfileComponents/ProfileUserProducts";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { TTab } from "@/src/types";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

const Page = () => {
  const params = useLocalSearchParams<{ id: Id<"users"> }>();
  const user = useQuery(api.api.users.getById, {
    id: params.id,
  });
  const { me } = useMeStore();
  const { settings } = useSettingsStore();
  const router = useRouter();

  const tabs = React.useMemo(() => {
    const tabs: TTab<"services" | "spares" | "wishlist">[] = [
      { icon: "git-branch-outline", id: "services", name: "Services" },
      { icon: "cog-outline", id: "spares", name: "Spares" },
      { icon: "heart-outline", id: "wishlist", name: "Wishlist" },
    ];
    return tabs;
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: `Your Profile`,
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
                  router.replace("/(tabs)/home");
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
      <View
        style={{
          flex: 1,
          padding: 10,
          paddingTop: Platform.select({ ios: 150, android: 10 }),
          alignSelf: "center",
        }}
      >
        <ProfileUserCard user={user} />
        <ProfileInfo user={user} />
        <ProfileUserProducts
          isMe={user?.id === me?.id}
          tabs={tabs}
          user={user}
        />
      </View>
    </>
  );
};

export default Page;
