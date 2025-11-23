import { TUser } from "@/convex/tables/users";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Rating } from "@kolking/react-native-rating";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";
import Card from "../Card/Card";
import ContentLoader from "../ContentLoader/ContentLoader";
import AnalyticsBottomSheet from "../BottomSheets/AnalyticsBottomSheet";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const ProfileUserCard = ({ user }: { user?: TUser | null }) => {
  const [loaded, setLoaded] = React.useState(false);
  const { me } = useMeStore();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const rating = React.useMemo(() => {
    if (!!!user?.ratting) return 5;
    const sum = user.ratting.reduce((a, b) => a + b, 0);
    return sum / user.ratting.length;
  }, [user?.ratting]);

  const analyticsBottomSheetRef = React.useRef<BottomSheetModal>(null);

  if (!!!user)
    return (
      <Animated.View entering={SlideInLeft.duration(400).delay(400)}>
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            alignItems: "center",
            height: 200,
            justifyContent: "center",
          }}
        >
          <ContentLoader
            style={{
              padding: 5,
              width: "45%",
              borderRadius: 3,
              position: "absolute",
              top: 10,
              left: 10,
            }}
          />
          <ContentLoader
            style={{
              bottom: 5,
              position: "absolute",
              right: 5,
              width: 100,
              padding: 20,
              borderRadius: 5,
            }}
          />
          <View
            style={{
              alignItems: "center",
              width: "100%",
              gap: 5,
            }}
          >
            <ContentLoader
              style={{
                padding: 15,
                width: "45%",
                borderRadius: 5,
              }}
            />
            <ContentLoader
              style={{
                padding: 5,
                width: "40%",
                borderRadius: 5,
              }}
            />

            <Rating
              fillColor={COLORS.gray100}
              style={{}}
              size={20}
              rating={5}
              disabled
            />
          </View>

          <View
            style={{
              position: "absolute",
              bottom: -80 / 2,
              width: 100,
              height: 100,
              borderWidth: 10,
              borderRadius: 100,
              borderColor: COLORS.white,
            }}
          >
            <ContentLoader
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                position: "absolute",
                zIndex: 1,
              }}
            />
          </View>
        </Card>
      </Animated.View>
    );
  return (
    <Animated.View entering={SlideInLeft.duration(400).delay(400)}>
      {!!!user?._id ? null : (
        <AnalyticsBottomSheet id={user._id} ref={analyticsBottomSheetRef} />
      )}
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          alignItems: "center",
          height: 200,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            backgroundColor: COLORS.secondary,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 10,
            right: 10,
          }}
          hitSlop={20}
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            analyticsBottomSheetRef.current?.present();
          }}
        >
          <Ionicons name="analytics" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            fontFamily: FONTS.bold,
            color: COLORS.gray,
            position: "absolute",
            top: 10,
            left: 10,
          }}
        >
          Account created {dayjs(new Date(user._creationTime!)).fromNow()} ago
        </Text>

        {me?.id === user.id ? (
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: COLORS.tertiary,
                position: "absolute",
                bottom: 5,
                right: 5,
                width: 100,
              },
            ]}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              router.navigate({
                pathname: "/(profile)/pi",
              });
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.bold,
                fontSize: 18,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        ) : null}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 25,
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 14,
              marginTop: -5,
              color: COLORS.gray,
            }}
          >
            {user.email}
          </Text>
          <Rating style={{}} size={20} rating={rating} disabled />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: -80 / 2,
            width: 100,
            height: 100,
            borderWidth: 10,
            borderRadius: 100,
            borderColor: COLORS.white,
          }}
        >
          {!loaded ? (
            <ContentLoader
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                position: "absolute",
                zIndex: 1,
              }}
            />
          ) : null}

          <TouchableOpacity
            disabled={!!!user.image}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              router.navigate({
                pathname: "/(common)/image-viewer",
                params: {
                  title: `${user.firstName} ${user.lastName}`,
                  uri: user.image,
                },
              });
            }}
          >
            <Animated.Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
              }}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              source={{
                uri: !!user.image
                  ? user.image
                  : Image.resolveAssetSource(
                      require("../../../assets/images/default.jpg")
                    ).uri,
              }}
            />
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );
};

export default ProfileUserCard;

const styles = StyleSheet.create({
  btn: {
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
