import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import ContentLoader from "../ContentLoader/ContentLoader";
import ChatSkeleton from "./ChatSkeleton";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Chat = ({ id }: { id: Id<"chats"> }) => {
  const chat = useQuery(api.api.chats.chat, {
    id,
  });
  const [loaded, setLoaded] = React.useState(false);
  const { me } = useMeStore();
  const router = useRouter();
  const { settings } = useSettingsStore();

  const unread = useQuery(api.api.chats.count, {
    userId: me?._id,
    id: chat?._id,
  });

  const deleteChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };
  const markAsReadOrUnRead = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };
  const openChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!chat) return;
    router.navigate({
      pathname: "/(chat)/[chatId]",
      params: {
        chatId: chat._id,
      },
    });
  };

  if (!!!chat) return <ChatSkeleton />;
  return (
    <Swipeable
      overshootLeft={false}
      friction={3}
      overshootFriction={8}
      enableTrackpadTwoFingerGesture
      renderRightActions={(_progress, _dragX) => {
        return (
          <>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                minWidth: 50,
                height: "100%",
                backgroundColor: COLORS.red,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
              onPress={deleteChat}
            >
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                minWidth: 50,
                height: "100%",
                backgroundColor: COLORS.tertiary,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
              onPress={markAsReadOrUnRead}
            >
              <Ionicons
                name={!!!chat ? "mail-open-outline" : "mail-outline"}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </>
        );
      }}
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={(_progress, _dragX) => {
        return (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              minWidth: 50,
              backgroundColor: COLORS.tertiary,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              marginBottom: 5,
              height: "100%",
            }}
            onPress={openChat}
          >
            <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
              Open
            </Text>
          </TouchableOpacity>
        );
      }}
      containerStyle={{
        maxWidth: 500,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <TouchableOpacity
        style={{
          gap: 10,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        }}
        onPress={openChat}
      >
        <View>
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
        </View>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.bold,
              fontSize: 20,
              marginTop: -10,
            }}
          >
            {chat.itemName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginTop: -5,
              fontFamily: FONTS.bold,
              color: COLORS.gray,
            }}
          >
            Listed {dayjs(new Date(chat.item?._creationTime!)).fromNow()} ago •{" "}
            {chat.seller?._id === me?._id
              ? "You"
              : `${chat.seller?.firstName} ${chat.seller?.lastName}`}
          </Text>
        </View>
        {!!unread ? (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.tertiary,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.bold,
              }}
            >
              {unread <= 9 ? unread : "9+"}
            </Text>
          </View>
        ) : (
          <View />
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

export default Chat;
