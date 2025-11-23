import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS } from "@/src/constants";

import { useRouter } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMeStore } from "@/src/store/useMeStore";

const UserProfileBiographyBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["25%"], []);
    const { me } = useMeStore();
    const router = useRouter();
    const { settings } = useSettingsStore();
    const { dismiss } = useBottomSheetModal();
    const updateUser = useMutation(api.api.users.updateBio);
    return (
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
          }}
        >
          <View style={{}}>
            <Text
              style={[
                {
                  textAlign: "center",
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  maxWidth: 400,
                  height: 50,
                },
              ]}
            >
              Hey {me?.firstName} {me?.lastName} 👋, Write a short bio about
              you.
            </Text>
          </View>
          <BottomSheetView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              width: "100%",
              maxWidth: 400,
              padding: 10,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: COLORS.tertiary,
                  backgroundColor: COLORS.white,
                  elevation: 2,
                },
              ]}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }

                const _id = updateUser({
                  biography: undefined,
                  id: me?._id,
                });
                if (!!_id) {
                  dismiss();
                }
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  color: COLORS.black,
                }}
              >
                Not Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                { borderBottomWidth: 1, borderColor: COLORS.tertiary },
              ]}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.navigate({
                  pathname: "/(profile)/biography",
                });
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  color: COLORS.white,
                }}
              >
                Add Bio
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default UserProfileBiographyBottomSheet;

const styles = StyleSheet.create({
  btn: {
    width: 150,
    padding: 5,
    borderRadius: 999,
    backgroundColor: COLORS.tertiary,
    alignItems: "center",
  },
});
