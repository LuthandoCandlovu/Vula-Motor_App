import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { Rating } from "@kolking/react-native-rating";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import Card from "../Card/Card";
import ContentLoader from "../ContentLoader/ContentLoader";
import ProductUserSkeleton from "./ProductUserSkeleton";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const ProductUser = ({ id }: { id: Id<"users"> }) => {
  const user = useQuery(api.api.users.getById, { id });
  const [loaded, setLoaded] = React.useState(false);
  const { me } = useMeStore();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const rating = React.useMemo(() => {
    if (!!!user?.ratting) return 5;
    const sum = user.ratting.reduce((a: any, b: any) => a + b, 0);
    return sum / user.ratting.length;
  }, [user?.ratting]);

  if (!!!user) return <ProductUserSkeleton />;

  return (
    <Animated.View
      entering={SlideInRight.duration(400).delay(400)}
      style={{ marginVertical: 10 }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
          disabled={user.id === me?.id}
          onPress={async () => {
            if (settings.haptics) await onImpact();
            router.navigate({
              pathname: "/(profile)/[id]",
              params: {
                id: user._id,
              },
            });
          }}
        >
          <View>
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
          </View>

          <View style={{ flex: 1, marginTop: -5 }}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
              }}
            >
              {`${
                user.id === me?.id
                  ? "You"
                  : user.firstName.concat(" ", user.lastName)
              }`}
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
            <Rating style={{}} size={15} rating={rating} disabled />
          </View>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            fontFamily: FONTS.bold,
            color: COLORS.gray,
            alignSelf: "flex-end",
          }}
        >
          Account created {dayjs(new Date(user._creationTime!)).fromNow()} ago
        </Text>
      </Card>
    </Animated.View>
  );
};

export default ProductUser;
