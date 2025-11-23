import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
const MessageOptionsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { _id: Id<"messages"> }
>(({ _id }, ref) => {
  const reactToMessageMutation = useMutation(api.api.messages.react);
  const deleteForEveryoneMutation = useMutation(
    api.api.messages.deletedForEveryone
  );
  const deleteForMeMutation = useMutation(api.api.messages.deletedForMe);
  const message = useQuery(api.api.messages.get, { _id });
  const { me } = useMeStore();
  const { dismiss } = useBottomSheetModal();
  const isMine = me?.id === message?.sender?.id;
  const snapPoints = React.useMemo(
    () => [Platform.select({ ios: "25%", android: "20%" }) || "20%"],
    []
  );
  const { settings } = useSettingsStore();
  const deleteForMe = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!me || !!!message) {
      dismiss();
      return;
    }
    await deleteForMeMutation({ _id: message._id, id: me.id });
    dismiss();
  };
  const react = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!message) return;
    await reactToMessageMutation({ _id: message._id });

    dismiss();
  };
  const deleteForEveryone = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!me || !!!message) {
      dismiss();
      return;
    }
    await deleteForEveryoneMutation({ _id: message._id, id: me.id });
    dismiss();
  };

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
      <BottomSheetView style={{ flex: 1 }}>
        <BottomSheetView
          style={{
            padding: 10,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={react}
            style={styles.btn}
            disabled={isMine}
          >
            <Ionicons
              name={message?.liked ? "heart" : "heart-outline"}
              size={18}
              color={
                isMine
                  ? COLORS.gray
                  : message?.liked
                    ? COLORS.red
                    : COLORS.black
              }
            />
            <Text
              style={[
                styles.btnText,
                {
                  color: isMine ? COLORS.gray : COLORS.black,
                },
              ]}
            >
              {message?.liked ? "Unlike" : "Like"} message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteForMe}
            style={styles.btn}
            disabled={!isMine}
          >
            <MaterialIcons
              name="delete-outline"
              size={18}
              color={isMine ? COLORS.red : COLORS.gray}
            />
            <Text
              style={[
                styles.btnText,
                { color: isMine ? COLORS.red : COLORS.gray },
              ]}
            >
              Delete for me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteForEveryone}
            style={styles.btn}
            disabled={!isMine}
          >
            <MaterialIcons
              name="delete-sweep"
              size={18}
              color={isMine ? COLORS.red : COLORS.gray}
            />
            <Text
              style={[
                styles.btnText,
                { color: isMine ? COLORS.red : COLORS.gray },
              ]}
            >
              Delete for everyone
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default MessageOptionsBottomSheet;

const styles = StyleSheet.create({
  btn: {
    gap: 10,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  btnText: {
    fontFamily: FONTS.bold,
  },
});
