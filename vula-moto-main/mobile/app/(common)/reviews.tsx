import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/src/components/Card/Card";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useMeStore } from "@/src/store/useMeStore";
import ContentLoader from "@/src/components/ContentLoader/ContentLoader";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: Id<"users"> }>();
  const { settings } = useSettingsStore();
  const router = useRouter();

  const reviews = useQuery(api.api.reviews.get, {
    userId: id,
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: `Reviews`,
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

      <ScrollView
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: COLORS.main,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, gap: 5 }}
      >
        {!!!reviews || reviews?.length === 0
          ? Array(10)
              .fill(30)
              .map((_, index) => (
                <Card
                  key={index}
                  style={{
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    alignSelf: "center",
                    width: "100%",
                  }}
                >
                  <ContentLoader
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                  <View style={{ flex: 1, gap: 5 }}>
                    <ContentLoader
                      style={{
                        width: "100%",
                        padding: 5,
                        borderRadius: 999,
                      }}
                    />
                    <ContentLoader
                      style={{
                        width: "100%",
                        padding: 5,
                        borderRadius: 999,
                      }}
                    />
                    <ContentLoader
                      style={{
                        width: "100%",
                        padding: 5,
                        borderRadius: 999,
                      }}
                    />
                    <ContentLoader
                      style={{
                        width: "100%",
                        padding: 5,
                        borderRadius: 999,
                      }}
                    />
                    <ContentLoader
                      style={{
                        width: "50%",
                        padding: 5,
                        borderRadius: 999,
                      }}
                    />
                  </View>
                </Card>
              ))
          : reviews.map((review) => (
              <Card
                key={review._id}
                style={{
                  gap: 10,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                <ReviewProfile id={review?.userId} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                    }}
                  >
                    {review.review}
                  </Text>
                </View>
              </Card>
            ))}
      </ScrollView>
    </>
  );
};

export default Page;

const ReviewProfile = ({ id }: { id: Id<"users"> }) => {
  const user = useQuery(api.api.users.getById, {
    id,
  });
  const { me } = useMeStore();
  const router = useRouter();
  const { settings } = useSettingsStore();

  if (!!!user)
    return (
      <Animated.View entering={SlideInLeft.duration(200).delay(200)}>
        <ContentLoader
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
      </Animated.View>
    );

  return (
    <Animated.View entering={SlideInLeft.duration(200).delay(200)}>
      <TouchableOpacity
        onPress={async () => {
          if (settings.haptics) await onImpact();
          if (me?._id !== user.id) {
            return;
          }
          router.navigate({ pathname: "/(profile)/[id]", params: user?._id });
        }}
      >
        <Image
          source={{ uri: user?.image }}
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
