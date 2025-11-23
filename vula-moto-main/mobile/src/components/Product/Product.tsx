import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useLocationStore } from "@/src/store/locationStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { calculateDistance } from "@/src/utils/distance";
import { Rating } from "@kolking/react-native-rating";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import ContentLoader from "../ContentLoader/ContentLoader";
import ProductSkeleton from "./ProductSkeleton";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Product = ({
  id,
  withoutUser,
}: {
  id: Id<"items">;
  withoutUser?: boolean;
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const product = useQuery(api.api.items.getItemById, { id });
  const { location } = useLocationStore();
  const { settings } = useSettingsStore();
  const router = useRouter();
  if (!!!product) {
    return <ProductSkeleton />;
  }
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        maxWidth: 200,
        minWidth: 150,
        height: 300,
        position: "relative",
        marginVertical: 15,
        backgroundColor: COLORS.main,
      }}
      onPress={async () => {
        if (settings.haptics) {
          await onImpact();
        }
        router.navigate({
          pathname: "/(common)/product",
          params: {
            id: product._id,
          },
        });
      }}
    >
      {product?.stock ? (
        <View
          style={{
            backgroundColor: product.stock < 10 ? COLORS.red : COLORS.tertiary,
            justifyContent: "center",
            alignItems: "center",
            width: 30,
            height: 30,
            position: "absolute",
            zIndex: 2,
            right: 0,
            opacity: 0.7,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              color: COLORS.white,
            }}
          >
            {product.stock}
          </Text>
        </View>
      ) : null}
      <View
        style={{
          backgroundColor: COLORS.main,
          justifyContent: "center",
          alignItems: "center",
          width: 30,
          position: "absolute",
          zIndex: 2,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: COLORS.gray,
          }}
        >
          {dayjs(new Date(product._creationTime)).fromNow()}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {!loaded && (
          <ContentLoader
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 1,
              borderRadius: 5,
            }}
          />
        )}
        <Animated.Image
          source={{ uri: product.image! }}
          style={{
            width: "100%",
            resizeMode: "cover",
            flex: 1,
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </View>
      <Text numberOfLines={1} style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
        {product.title}
      </Text>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 20,
            }}
          >
            R{product.price.toFixed(2)}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 16,
            }}
          >
            Was{" "}
            <Text
              style={{
                color: COLORS.red,
                textDecorationLine: "line-through",
              }}
            >
              R{product.previousPrice.toFixed(2)}
            </Text>
          </Text>
        </View>
        <Text
          style={{
            fontFamily: FONTS.regular,
            alignSelf: "flex-end",
          }}
        >
          {calculateDistance(
            {
              latitude: location.lat,
              longitude: location.lon,
            },
            {
              latitude: product.location?.lat as any,
              longitude: product.location?.lon as any,
            }
          )}{" "}
          away
        </Text>
      </View>
      {withoutUser ? null : <ProductUser id={product.userId} />}
    </TouchableOpacity>
  );
};

export default Product;

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

  if (!!!user) {
    return (
      <View
        style={{
          gap: 10,
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <ContentLoader style={{ width: 40, height: 40, borderRadius: 40 }} />
        <View style={{ flex: 1 }}>
          <ContentLoader
            style={{
              width: "80%",
              height: 15,
              marginBottom: 3,
              borderRadius: 3,
            }}
          />
          <Rating
            fillColor={COLORS.gray100}
            style={{}}
            size={15}
            rating={5}
            disabled
          />
        </View>
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={{
        gap: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: COLORS.main,
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
              width: 40,
              height: 40,
              borderRadius: 40,
              position: "absolute",
              zIndex: 1,
            }}
          />
        ) : null}

        <Animated.Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
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
            fontSize: 15,
          }}
        >
          {`${
            user.id === me?.id
              ? "You"
              : user.firstName.concat(" ", user.lastName)
          }`}
        </Text>
        <Rating
          style={{
            marginTop: -3,
          }}
          size={15}
          rating={rating}
          disabled
        />
      </View>
    </TouchableOpacity>
  );
};
