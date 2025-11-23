import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { TChatExpanded } from "@/src/types";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContentLoader from "../ContentLoader/ContentLoader";
import HeaderBackButton from "../HeaderBackButton/HeaderBackButton";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const ChatHeader = ({ chat }: { chat: TChatExpanded }) => {
  const { top } = useSafeAreaInsets();
  const [loaded, setLoaded] = React.useState(false);
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { me } = useMeStore();

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.tertiary }}>
      <View
        style={{
          flexDirection: "row",
          top: Platform.select({
            ios: 0,
            android: top,
          }),
          paddingBottom: 14,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: COLORS.main,
          gap: 10,
          paddingHorizontal: 15,
          paddingTop: 10,
          alignItems: "center",
          backgroundColor: COLORS.tertiary,
        }}
      >
        <HeaderBackButton title={""} />
        <TouchableOpacity
          onPress={async () => {
            if (!loaded) return;
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate({
              pathname: "/(common)/image-viewer",
              params: {
                uri: chat.item?.image,
                title: chat.itemName,
              },
            });
          }}
        >
          {!loaded ? (
            <ContentLoader
              style={{
                width: 50,
                height: 50,
                borderRadius: 5,
                position: "absolute",
                zIndex: 1,
                display: loaded ? "none" : "flex",
              }}
            />
          ) : null}

          <Animated.Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 5,
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            source={{
              uri: chat.item?.image || undefined,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate({
              pathname: "/(common)/product",
              params: {
                id: chat.itemId,
              },
            });
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              marginTop: -5,
              color: COLORS.white,
            }}
          >
            {chat.itemName}
          </Text>

          <Text
            style={{
              fontFamily: FONTS.bold,
              color: COLORS.white,
              marginTop: Platform.select({ android: -5, ios: 0 }),
              fontSize: 12,
            }}
            numberOfLines={1}
          >
            {chat.seller?._id === me?._id
              ? "You listed this item."
              : `${chat.seller?.firstName} ${chat.seller?.lastName} listed this item.`}
            {" • "}
            {dayjs(new Date(chat.item?._creationTime!)).fromNow()} ago
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            // chatOptionsBottomSheet.current?.present();
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="ellipsis-vertical-outline"
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatHeader;
