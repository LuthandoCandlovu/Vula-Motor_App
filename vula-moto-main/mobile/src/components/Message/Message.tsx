import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TMessage } from "@/convex/tables/messages";
import { TUser } from "@/convex/tables/users";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import MessageOptionsBottomSheet from "../BottomSheets/MessageOptionsBottomSheet";
import Card from "../Card/Card";
import ContentLoader from "../ContentLoader/ContentLoader";
import MessageDeletedFor1 from "./MessageDeletedFor1";
import MessageDeletedForEveryone from "./MessageDeletedForEveryone";
import MessageSkeleton from "./MessageSkeleton";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Message = ({
  message,
  lasMessageId,
}: {
  message: TMessage & { sender: TUser };
  lasMessageId?: Id<"messages">;
}) => {
  const { me } = useMeStore();
  const { settings } = useSettingsStore();
  const messageOptionsRef = React.useRef<BottomSheetModal>(null);
  const reactToMessageMutation = useMutation(api.api.messages.react);
  const react = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!message || !!!me || message.sender?.id === me.id) return;
    await reactToMessageMutation({ _id: message._id });
  };

  const tap = Gesture.Tap().runOnJS(true).numberOfTaps(2).onEnd(react);
  if (!!!message) return <MessageSkeleton />;

  if (message.deletedFor?.length === 1 && me?.id === message.sender?.id)
    return <MessageDeletedFor1 isMine />;
  if (message.deletedFor?.length && message.deletedFor.length > 1)
    return <MessageDeletedForEveryone isMine={me?.id === message.sender?.id} />;

  return (
    <>
      <MessageOptionsBottomSheet ref={messageOptionsRef} _id={message._id} />
      <GestureDetector gesture={tap}>
        <TouchableOpacity
          onLongPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            messageOptionsRef.current?.present();
          }}
          style={{
            maxWidth: "80%",
            alignSelf:
              me?.id === message.sender?.id ? "flex-end" : "flex-start",
            marginBottom: 5,
            minWidth: 100,
            width:
              !!message.image || !!message.audio || !!message.document
                ? 230
                : "auto",
          }}
        >
          <Card
            style={{
              margin: 0,
              backgroundColor:
                me?.id === message.sender?.id ? COLORS.main : COLORS.gray100,
            }}
          >
            <MessageAttachment message={message} />
            <Text
              style={{
                fontFamily: FONTS.bold,
                color:
                  me?.id === message.sender?.id ? COLORS.black : COLORS.black,
              }}
            >
              {message.text}
            </Text>

            {message.liked ? (
              <Ionicons
                name="heart"
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: -5,
                }}
                size={18}
                color={COLORS.red}
              />
            ) : null}
          </Card>
          {me?.id === message.sender?.id ? (
            <View style={{ alignSelf: "flex-end", marginRight: 5 }}>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 10,
                }}
              >
                {message.seen
                  ? lasMessageId === message._id
                    ? `Seen • ${dayjs(new Date(message._creationTime)).fromNow()} ago`
                    : ""
                  : `Delivered • ${dayjs(new Date(message._creationTime)).fromNow()} ago`}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </GestureDetector>
    </>
  );
};

export default Message;

const MessageAttachment = ({ message }: { message: any }) => {
  const [state, setState] = React.useState({
    loadedImage: false,
    loadedDocument: false,
    loadedAudio: false,
  });
  const router = useRouter();
  const { settings } = useSettingsStore();
  if (!!message?.image)
    return (
      <TouchableOpacity
        style={{ width: "100%", height: 200 }}
        onPress={async () => {
          if (settings.haptics) {
            await onImpact();
          }
          router.navigate({
            pathname: "/image-viewer",
            params: {
              uri: message.image,
              title: "Image Preview",
            },
          });
        }}
      >
        <ContentLoader
          style={{
            position: "absolute",
            borderRadius: 5,
            width: "100%",
            height: "100%",
            display: state.loadedImage ? "none" : "flex",
            zIndex: 1,
          }}
        />
        <Animated.Image
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 5,
          }}
          onLoad={() => {
            setState((state) => ({
              ...state,
              loadedImage: true,
            }));
          }}
          onError={() => {
            setState((state) => ({
              ...state,
              loadedImage: true,
            }));
          }}
          source={{
            uri: message.image,
          }}
        />
      </TouchableOpacity>
    );
  if (!!message?.audio)
    return (
      <View>
        <Text>Document</Text>
      </View>
    );
  if (!!message?.document)
    return (
      <TouchableOpacity>
        <Text>Document</Text>
      </TouchableOpacity>
    );

  return null;
};
