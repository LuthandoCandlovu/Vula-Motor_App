import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  APP_NAME,
  COLORS,
  FONTS,
  LANGUAGE_OPTIONS,
  relativeTimeObject,
} from "@/src/constants";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "@/src/components/Card/Card";
import ContentLoader from "@/src/components/ContentLoader/ContentLoader";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import Animated, { SlideInLeft } from "react-native-reanimated";
import ProductMapBottomSheet from "@/src/components/BottomSheets/ProductMapBottomSheet";
import ProductControls from "@/src/components/ProductComponents/ProductControls";
import ProductUser from "@/src/components/ProductComponents/ProductUser";
import ProductUserSkeleton from "@/src/components/ProductComponents/ProductUserSkeleton";
import { useCurrentLocation } from "@/src/hooks";
import { calculateDistance } from "@/src/utils/distance";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { translateText } from "@/src/utils/react-query";
import CheckoutComponent from "@/src/components/CheckoutComponent/CheckoutComponent";
import { useMeStore } from "@/src/store/useMeStore";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const Page = () => {
  const { settings } = useSettingsStore();
  const [loaded, setLoaded] = React.useState(false);
  const params = useLocalSearchParams<{
    id: Id<"items">;
  }>();
  const router = useRouter();
  const product = useQuery(api.api.items.getItemById, {
    id: params.id,
  });
  const productMapBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const location = useCurrentLocation();
  const [description, setDescription] = React.useState("");
  const { me } = useMeStore();
  const language = React.useMemo(
    () => LANGUAGE_OPTIONS.find((l) => l.value === settings.lang)!,
    [settings]
  );

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["translate-text"],
    mutationFn: translateText,
    networkMode: "offlineFirst",
  });

  React.useEffect(() => {
    if (!!product?.description?.trim()) {
      setDescription(product.description);
    }
  }, [product]);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: !!product ? product.title : "Product",
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
          headerStyle: {
            backgroundColor: COLORS.tertiary,
          },
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 100,
          paddingTop: Platform.select({ ios: 100, android: 10 }),
        }}
        style={{ flex: 1 }}
      >
        {!!product ? (
          <ProductMapBottomSheet
            product={product}
            ref={productMapBottomSheetRef}
          />
        ) : null}
        <Animated.View entering={SlideInLeft.duration(400).delay(400)}>
          {!!product ? (
            <Card
              style={{
                width: "100%",
                maxWidth: 400,
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  zIndex: 10,
                  backgroundColor: COLORS.secondary,
                  paddingVertical: 5,
                  width: 200,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.white,
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  To be {!!!product?.delivery ? "collect" : product.delivery}ed
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 400,
                }}
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  router.navigate({
                    pathname: "/(common)/image-viewer",
                    params: {
                      title: product.title,
                      uri: product.image,
                    },
                  });
                }}
              >
                {!loaded ? (
                  <ContentLoader
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      borderRadius: 5,
                      zIndex: 1,
                    }}
                  />
                ) : null}
                <Animated.Image
                  source={{ uri: product.image! }}
                  style={{
                    backgroundColor: COLORS.white,
                    width: "100%",
                    height: 400,
                    borderRadius: 5,
                  }}
                  onLoad={() => setLoaded(true)}
                  onError={() => setLoaded(true)}
                />
              </TouchableOpacity>

              <View style={{}}>
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: FONTS.bold,
                  }}
                >
                  {product.title}
                </Text>
              </View>
              {!!product.stock ? (
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                    marginTop: -5,
                    color: product.stock < 10 ? COLORS.red : COLORS.tertiary,
                  }}
                >
                  {product.stock} left.
                </Text>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: FONTS.bold,
                  }}
                >
                  R {product.price.toFixed(2)}
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
                style={[
                  {
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                  },
                ]}
              >
                {description}
              </Text>

              <View>
                <TouchableOpacity
                  hitSlop={30}
                  disabled={isPending}
                  style={{
                    flexDirection: "row",
                    gap: 5,
                  }}
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    mutateAsync({
                      text: description,
                      to: settings.lang,
                    }).then((data) => {
                      if (data.success) {
                        setDescription(data.translation!);
                      }
                      if (!!data.error) {
                        Alert.alert(
                          APP_NAME,
                          data.error,
                          [
                            {
                              style: "default",
                              text: "OK",
                              onPress: async () => {
                                if (settings.haptics) {
                                  await onImpact();
                                }
                              },
                            },
                          ],
                          { cancelable: false }
                        );
                      }
                    });
                  }}
                >
                  {isPending ? (
                    <ActivityIndicator size={"small"} color={COLORS.tertiary} />
                  ) : null}
                  <MaterialIcons
                    name="translate"
                    size={20}
                    color={COLORS.tertiary}
                  />
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 16,
                      color: COLORS.tertiary,
                    }}
                  >
                    Translate to {language.name}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                  }}
                >
                  You can change the default translation language in the
                  settings.
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  justifyContent: "flex-end",
                }}
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  if (!!!product || product?.userId === me?._id) {
                    return;
                  }
                  productMapBottomSheetRef.current?.present();
                }}
              >
                <Ionicons name="location" color={COLORS.secondary} size={20} />
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                    color: COLORS.secondary,
                    textDecorationLine: "underline",
                  }}
                >
                  Listed at, {product.location.address.name}.
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FONTS.bold,
                  color: COLORS.gray,
                }}
              >
                Listed {dayjs(new Date(product._creationTime!)).fromNow()} ago •{" "}
                <Text
                  style={{
                    color: COLORS.secondary,
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
              </Text>
            </Card>
          ) : (
            <Card
              style={{
                width: "100%",
                maxWidth: 400,
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 400,
                }}
              >
                <ContentLoader
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    borderRadius: 5,
                    zIndex: 1,
                  }}
                />
              </View>

              <ContentLoader
                style={{
                  borderRadius: 5,
                  padding: 15,
                  marginTop: 10,
                  width: "70%",
                }}
              />
              <ContentLoader
                style={{
                  borderRadius: 5,
                  padding: 10,
                  marginTop: 3,
                  width: "40%",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                }}
              >
                <ContentLoader
                  style={{
                    borderRadius: 5,
                    padding: 15,
                    width: "40%",
                  }}
                />
                <ContentLoader
                  style={{
                    borderRadius: 5,
                    padding: 6,
                    width: "40%",
                  }}
                />
              </View>

              <ContentLoader
                style={{
                  borderRadius: 5,
                  padding: 5,
                  width: "100%",
                  marginTop: 10,
                  marginBottom: 3,
                }}
              />
              <ContentLoader
                style={{
                  borderRadius: 5,
                  padding: 5,
                  width: "100%",
                  marginBottom: 3,
                }}
              />
              <ContentLoader
                style={{
                  borderRadius: 5,
                  padding: 5,
                  width: "50%",
                  marginBottom: 3,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  justifyContent: "flex-end",
                }}
              >
                <ContentLoader
                  style={{
                    borderRadius: 5,
                    padding: 15,
                    width: "50%",
                  }}
                />
              </View>
              <ContentLoader
                style={{
                  borderRadius: 5,
                  padding: 8,
                  width: "40%",
                  marginBottom: 3,
                }}
              />
            </Card>
          )}
        </Animated.View>
        <View style={{ height: 5 }} />
        {!!!product || product?.userId === me?._id ? null : (
          <CheckoutComponent
            id={params.id}
            delivery={`To be ${product?.delivery ? "collect" : product.delivery}ed`}
            price={product.price}
          />
        )}

        <View style={{ height: 10 }} />
        {!!!product ? (
          <ProductUserSkeleton />
        ) : (
          <ProductUser id={product.userId} />
        )}
        <ProductControls
          category={product?.type}
          title={product?.title}
          productId={product?._id}
          userId={product?.userId}
        />
      </ScrollView>
    </>
  );
};

export default Page;
