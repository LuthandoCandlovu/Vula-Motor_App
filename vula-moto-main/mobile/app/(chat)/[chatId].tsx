import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import WhatIsEnd2EndEncryptionBottomSheet from "@/src/components/BottomSheets/ChatsOptionsBottomSheet";
import ChatHeader from "@/src/components/Headers/ChatHeader";
import Message from "@/src/components/Message/Message";
import MessageAttachment from "@/src/components/MessageInput/MessageAttachment";
import MessageInput from "@/src/components/MessageInput/MessageInput";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { TAttachmentMessageInput } from "@/src/types";
import { onImpact } from "@/src/utils";
import { uploadFile } from "@/src/utils/react-query";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation as useMutationReactQuery } from "@tanstack/react-query";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const PAGE_SIZE = 30;

const Page = () => {
  const { chatId } = useLocalSearchParams<{ chatId: Id<"chats"> }>();
  const { me } = useMeStore();
  const [state, setState] = React.useState({ loading: false });
  const readMessagesMutation = useMutation(api.api.messages.readMessages);
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.api.messages.chatMessages,
    {
      chatId: chatId,
    },
    { initialNumItems: PAGE_SIZE }
  );

  const chatters = useQuery(api.api.messages.getChatCollaborators, {
    chatId,
  });

  const scrollViewRef = React.useRef<ScrollView>(null);
  const end2EndEncryptionRef = React.useRef<BottomSheetModal>(null);
  const chat = useQuery(api.api.chats.chat, {
    id: chatId,
  });
  const { settings } = useSettingsStore();
  const [attachment, setAttachment] = React.useState<TAttachmentMessageInput>();
  const { mutateAsync, isPending } = useMutationReactQuery({
    mutationFn: uploadFile,
    mutationKey: ["upload-file"],
  });
  const addNotificationMutation = useMutation(api.api.notifications.add);
  const [message, setMessage] = React.useState("");
  const sendMessageMutation = useMutation(api.api.messages.send);
  // const deleteMutation = useMutation(api.api.chats.deleteChat);
  const deleteChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  const sendMessage = async (message: string) => {
    if (!!!me || !!!chat) return;
    setState((s) => ({ ...s, loading: true }));

    if (!!attachment) {
      const response = await fetch(attachment.uri);
      const blob = await response.blob();
      const storage = await mutateAsync({
        file: blob,
      });

      const _id = await sendMessageMutation({
        chatId: chat._id,
        senderId: me._id,
        text: message?.trim(),
        seen: false,
        audio: attachment.type === "audio" ? storage.id : undefined,
        image: attachment.type === "image" ? storage.id : undefined,
        document: attachment.type === "document" ? storage.id : undefined,
      });

      if (!!_id) {
        if (typeof chatters !== "undefined") {
          const toBeNotified = chatters.filter((c) => c !== me._id);
          if (toBeNotified.length === 1) {
            const [userId] = toBeNotified;
            addNotificationMutation({
              chatId: chat._id,
              body: `${me.firstName} ${me.lastName} sent you message.`,
              title: " - Message",
              opened: false,
              userId,
            });
          }
        }
        setMessage("");
        setAttachment(undefined);
      }

      setState((s) => ({ ...s, loading: false }));
      Keyboard.dismiss();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else {
      if (!!!message) return setState((s) => ({ ...s, loading: false }));
      const _id = await sendMessageMutation({
        chatId: chat._id,
        senderId: me._id,
        text: message?.trim(),
        seen: false,
      });
      if (!!_id) {
        //       if(me._id === chat.)

        // const sendNotification = async () => {
        //   registerForPushNotificationsAsync().then(async (token) => {
        //     if (!!token) {
        //       sendPushNotification(
        //         token,
        //         "Hello there",
        //         "Hello there",
        //         undefined,
        //         "Molo",
        //         { id: "hello" }
        //       );
        //     }
        //   });
        // };
        setMessage("");
        setAttachment(undefined);
      }
      setState((s) => ({ ...s, loading: false }));
      Keyboard.dismiss();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  React.useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (!!me && !!chatId) {
      readMessagesMutation({ id: me.id, chatId });
    }
  }, [chatId, me]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (!!!chat ? null : <ChatHeader chat={chat as any} />),
        }}
      />
      <WhatIsEnd2EndEncryptionBottomSheet ref={end2EndEncryptionRef} />
      <ImageBackground
        source={require("../../assets/images/wallpaper.png")}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          contentContainerStyle={{
            padding: 10,
            paddingTop: Platform.select({
              ios: 10,
              android: 40,
            }),
            paddingBottom: 10,
            flexDirection: "column-reverse",
          }}
          showsVerticalScrollIndicator={false}
        >
          {results.map((message) => (
            <Message
              lasMessageId={results.at(0)?._id}
              key={message._id}
              message={message as any}
            />
          ))}

          {status === "LoadingMore" || status === "LoadingFirstPage" ? (
            <ActivityIndicator
              size={20}
              style={{
                alignSelf: "center",
              }}
            />
          ) : null}
          {status === "CanLoadMore" ? (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 10,
                backgroundColor: COLORS.white,
                borderRadius: 30,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: COLORS.gray100,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                loadMore(PAGE_SIZE);
              }}
            >
              <Ionicons name="refresh-outline" size={15} color={COLORS.gray} />
            </TouchableOpacity>
          ) : null}

          <Text
            style={{
              fontFamily: FONTS.bold,
              alignSelf: "center",
              marginBottom: 10,
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 999,
              paddingVertical: 5,
              marginTop: 20,
            }}
          >
            Your messages are end-to-end encrypted.{" "}
            <Text
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                end2EndEncryptionRef.current?.present();
              }}
              style={{
                color: COLORS.secondary,
                textDecorationLine: "underline",
              }}
            >
              Learn more?
            </Text>
          </Text>
        </ScrollView>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.select({ android: 50, ios: 80 })}
        >
          {attachment ? (
            <MessageAttachment
              uploading={isLoading || state.loading}
              attachment={attachment}
              onRemove={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                setAttachment(undefined);
              }}
            />
          ) : null}
          <MessageInput
            onShouldSend={(value) => {
              sendMessage(value);
            }}
            message={message}
            setMessage={setMessage}
            onNewAttachment={(attachment) => setAttachment(attachment)}
            sending={state.loading || isPending}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
};

export default Page;
