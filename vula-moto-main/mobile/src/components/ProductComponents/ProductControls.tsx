import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { APP_NAME, COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { useWishlistStore } from "@/src/store/useWishlist";
import { onImpact } from "@/src/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Animated, { SlideInDown } from "react-native-reanimated";
import RateSellerBottomSheet from "../BottomSheets/RateSellerBottomSheet";
import Card from "../Card/Card";
import Button from "../Button/Button";
import UserReviewBottomSheet from "../BottomSheets/UserReviewBottomSheet";

const ProductControls = ({
  userId,
  productId,
  category,
  title,
}: {
  userId?: Id<"users">;
  productId?: Id<"items">;
  category?: "service" | "spare";
  title?: string;
}) => {
  const { wishlist } = useWishlistStore();

  const user = useQuery(api.api.users.getById, { id: userId! });
  const { settings } = useSettingsStore();
  const { me } = useMeStore();
  const router = useRouter();
  const rateSellerBottomSheet = React.useRef<BottomSheetModal>(null);
  const userReviewBottomSheet = React.useRef<BottomSheetModal>(null);
  const removeProductMutation = useMutation(api.api.items.remove);

  const exists = React.useMemo(() => {
    return !!wishlist.find((w) => w === productId);
  }, [wishlist, productId]);
  const createOrOpenChatMutation = useMutation(api.api.chats.createOrOpen);
  const addOrRemoveToMyWishList = useMutation(
    api.api.users.addOrRemoveToMyWishList
  );
  const [loading, setLoading] = React.useState(false);
  const addToWishlist = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!productId || !!!me) return;

    setLoading(true);
    await addOrRemoveToMyWishList({
      itemId: productId,
      userId: me.id,
    });
    setLoading(false);
    Alert.alert(
      APP_NAME,
      !exists
        ? `${title} was added to your Wishlist.`
        : `${title} was removed from your Wishlist.`,
      [
        {
          style: "cancel",
          onPress: async () => {
            if (settings.haptics) {
              await onImpact();
            }
          },
          text: "OK",
        },
      ]
    );
  };

  const chat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setLoading(true);
    if (!!!me || !!!productId) return;
    const id = await createOrOpenChatMutation({
      itemId: productId,
      myId: me.id,
    });

    if (!!id) {
      router.navigate({
        pathname: "/(chat)/[chatId]",
        params: {
          chatId: id,
        },
      });
      setLoading(false);
    } else {
      setLoading(false);
      Alert.alert(APP_NAME, "Failed to start a chat.");
    }
  };

  const rateSeller = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    rateSellerBottomSheet.current?.present();
  };

  const removeProduct = async () => {
    if (settings.haptics) {
      await onImpact();
    }

    if (!!!productId) return false;

    Alert.alert(
      APP_NAME,
      `Are you sure you want to remove '${title}' from the Vula Moto.`,
      [
        {
          text: "YES",
          onPress: async () => {
            if (settings.haptics) {
              await onImpact();
            }
            setLoading(true);
            const success = await removeProductMutation({ id: productId });
            setLoading(false);
            if (success) {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace({
                  pathname: "/(tabs)/home",
                });
              }
            }
          },
          style: "default",
        },
        {
          text: "NO",
          onPress: async () => {
            if (settings.haptics) {
              await onImpact();
            }
          },
          style: "cancel",
        },
      ]
    );
  };
  const editProduct = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    router.navigate({
      pathname: "/(common)/edit-product",
      params: {
        id: productId,
        category: category,
      },
    });
  };

  return (
    <>
      <Spinner visible={loading} animation="fade" />
      {user?._id ? (
        <RateSellerBottomSheet ref={rateSellerBottomSheet} userId={user._id} />
      ) : null}
      {user?._id ? (
        <UserReviewBottomSheet ref={userReviewBottomSheet} userId={user._id} />
      ) : null}
      <Animated.View entering={SlideInDown.duration(400).delay(400)}>
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            alignSelf: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: me?.id === user?.id ? 10 : 50,
            justifyContent: "center",
            paddingVertical: 20,
          }}
        >
          {me?.id === user?.id ? (
            <>
              <TouchableOpacity
                style={[
                  styles.normalBtn,
                  {
                    backgroundColor: COLORS.tertiary,
                  },
                ]}
                onPress={editProduct}
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
              <TouchableOpacity
                style={[styles.normalBtn, {}]}
                onPress={removeProduct}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={addToWishlist}
                  style={styles.iconBtn}
                >
                  <Ionicons
                    name={exists ? "heart" : "heart-outline"}
                    size={25}
                    color={COLORS.tertiary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={chat} style={styles.iconBtn}>
                  <Ionicons
                    name="chatbox-outline"
                    size={25}
                    color={COLORS.tertiary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={rateSeller} style={styles.iconBtn}>
                  <MaterialIcons
                    name="star-rate"
                    size={25}
                    color={COLORS.tertiary}
                  />
                </TouchableOpacity>
              </View>
              <Button
                title="Write a Review"
                style={{
                  flex: 1,
                  backgroundColor: COLORS.tertiary,
                }}
                onPress={() => userReviewBottomSheet?.current?.present()}
              />
            </>
          )}
        </Card>
      </Animated.View>
    </>
  );
};

export default ProductControls;

const styles = StyleSheet.create({
  normalBtn: {
    padding: 10,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
  },
});
