import { COLORS, FONTS } from "@/src/constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { SlideInLeft, ZoomInUp } from "react-native-reanimated";
import Card from "../Card/Card";

import { api } from "@/convex/_generated/api";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import ContentLoader from "../ContentLoader/ContentLoader";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface ProfileCardProps {
  cardStyle?: StyleProp<ViewStyle>;
  title?: string;
  isLoading?: boolean;
}
const ProfileCard = ({ cardStyle, title, isLoading }: ProfileCardProps) => {
  const { me } = useMeStore();
  const [loaded, setLoaded] = React.useState(false);
  const user = useQuery(api.api.users.get, { id: me?.id || "" });
  const { settings } = useSettingsStore();

  const router = useRouter();
  const rating = React.useMemo(() => {
    if (!!!user?.ratting) return 5;
    const sum = user.ratting.reduce((a: any, b: any) => a + b, 0);
    return sum / user.ratting.length;
  }, [user?.ratting]);

  return (
    <Card
      style={[
        {
          paddingTop: 80,
          paddingHorizontal: 50,
          borderRadius: 0,
        },
        cardStyle,
        { backgroundColor: COLORS.tertiary },
      ]}
    >
      <Animated.Text
        style={{
          fontFamily: FONTS.bold,
          fontSize: 25,
          marginBottom: 20,
          color: COLORS.white,
        }}
        entering={ZoomInUp.duration(200).delay(100)}
      >
        {title ? title : "Profile"}
      </Animated.Text>
      {isLoading ? (
        <SkeletonProfileCard />
      ) : (
        <>
          <AnimatedTouchableOpacity
            style={{
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
              paddingBottom: 10,
            }}
            entering={SlideInLeft.delay(100).duration(200)}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              router.navigate({
                pathname: "/(profile)/me",
                params: {
                  id: user?._id,
                },
              });
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            >
              {!loaded ? (
                <ContentLoader
                  style={{
                    position: "absolute",
                    backgroundColor: COLORS.white,
                    overflow: "hidden",
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    zIndex: 1,
                  }}
                />
              ) : null}
              <Animated.Image
                source={{ uri: me?.imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
                onError={(_error) => {
                  setLoaded(true);
                }}
                onLoad={() => {
                  setLoaded(true);
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                    color: COLORS.white,
                  }}
                >
                  {me?.firstName} {me?.lastName}{" "}
                </Text>
                {user?.verified ? (
                  <MaterialIcons
                    name="verified"
                    size={14}
                    color={COLORS.white}
                  />
                ) : null}
              </View>

              <Text style={{ fontFamily: FONTS.regular, color: COLORS.white }}>
                {me?.email}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={COLORS.white}
            />
          </AnimatedTouchableOpacity>

          <View
            style={{
              width: 50,
              height: 30,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: rating < 0.25 ? COLORS.red : COLORS.secondary,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 16,
                color: COLORS.white,
              }}
            >
              {rating.toFixed(1)}
            </Text>
          </View>
        </>
      )}
    </Card>
  );
};

export default ProfileCard;

const SkeletonProfileCard = () => (
  <View
    style={{
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
      paddingBottom: 10,
    }}
  >
    <ContentLoader style={{ width: 50, height: 50, borderRadius: 50 }} />
    <View style={{ flex: 1, gap: 3 }}>
      <ContentLoader style={{ width: 150, height: 15, borderRadius: 5 }} />
      <ContentLoader style={{ width: 100, height: 10, borderRadius: 5 }} />
    </View>
    <ContentLoader style={{ width: 20, height: 20, borderRadius: 5 }} />
  </View>
);
