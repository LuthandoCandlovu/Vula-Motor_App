import { api } from "@/convex/_generated/api";
import { APP_NAME, COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { useWishlistStore } from "@/src/store/useWishlist";
import { onImpact } from "@/src/utils";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const WishlistOptionsBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["25%"], []);
    const { wishlist, clear } = useWishlistStore();
    const [loading, setLoading] = React.useState(false);
    const { dismiss } = useBottomSheetModal();
    const { settings } = useSettingsStore();
    const { me } = useMeStore();

    const clearWishlistMutation = useMutation(api.api.users.clearMyWishList);
    const clearWishLists = async () => {
      if (settings.haptics) {
        await onImpact();
      }
      setLoading(true);
      const { success } = await clearWishlistMutation({
        id: me?.id || "",
      });
      if (success) {
        clear();
        Alert.alert(
          APP_NAME,
          "Your Wishlist items has been cleared on all devices.",
          [
            {
              text: "OK",
              style: "cancel",
              onPress: async () => {
                if (settings.haptics) {
                  await onImpact();
                }
              },
            },
          ]
        );
      }
      setLoading(false);

      dismiss();
    };

    return (
      <>
        <Spinner animation="fade" visible={loading} />
        <BottomSheetModal
          ref={ref}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={true}
          enableOverDrag={false}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
            />
          )}
        >
          <BottomSheetView
            style={{
              flex: 1,
              padding: 10,
              paddingBottom: 100,
            }}
          >
            <View>
              <Text
                style={[
                  {
                    textAlign: "center",
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                  },
                ]}
              >
                You have {wishlist?.length} item(s) and stock(s) in your
                wishlist.
              </Text>

              <TouchableOpacity
                disabled={wishlist.length === 0}
                style={styles.normalBtn}
                onPress={clearWishLists}
              >
                <MaterialIcons
                  name="clear-all"
                  size={24}
                  color={COLORS.white}
                />
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    color: COLORS.white,
                  }}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  }
);

export default WishlistOptionsBottomSheet;

const styles = StyleSheet.create({
  normalBtn: {
    padding: 10,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    marginTop: 30,
  },
});
