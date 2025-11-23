import { APP_NAME, COLORS, FONTS, LANGUAGE_OPTIONS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { ask, translateText } from "@/src/utils/react-query";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatbotAssistantBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["50%"], []);
    const { dismiss } = useBottomSheetModal();
    const { settings } = useSettingsStore();
    const [message, setMessage] = React.useState("");

    const [messages, setMessages] = React.useState<
      { me: boolean; message: string }[]
    >([]);

    const { mutateAsync, isPending, data } = useMutation({
      mutationKey: ["ask-bot"],
      mutationFn: ask,
      networkMode: "offlineFirst",
    });

    const sendMessage = async () => {
      if (settings.haptics) {
        await onImpact();
      }
      if (!!!message) return;
      setMessages((m) => [...m, { me: true, message }]);
      await mutateAsync({
        message,
      }).then((data) => {
        if (data?.response) {
          setMessages((m) => [...m, { me: false, message: data?.response }]);
          setMessage("");
        }
      });
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={false}
        enableOverDrag={false}
        handleComponent={null}
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
          <View
            style={{
              alignSelf: "flex-end",
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                backgroundColor: COLORS.main,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
              }}
              hitSlop={20}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                dismiss();
              }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.bold,
                marginBottom: 10,
              }}
            >
              Nina Chatbot
            </Text>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                gap: 5,
              }}
            >
              {messages.map((msg, i) => (
                <View
                  key={i}
                  style={{
                    maxWidth: "80%",
                    alignSelf: msg.me ? "flex-end" : "flex-start",
                    marginTop: 5,
                    borderRadius: 5,
                    backgroundColor: msg.me ? COLORS.main : COLORS.gray100,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                    }}
                  >
                    {msg.message}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <BottomSheetTextInput
                value={message}
                onChangeText={(text) => setMessage(text)}
                style={{
                  maxHeight: 100,
                  flex: 1,
                  backgroundColor: COLORS.main,
                  fontFamily: FONTS.regular,
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  fontSize: 16,
                }}
                multiline
                placeholder="Chat with me..."
                onSubmitEditing={sendMessage}
              />
              {isPending ? (
                <ActivityIndicator color={COLORS.tertiary} size={"small"} />
              ) : (
                <TouchableOpacity onPress={sendMessage} style={{}}>
                  <Ionicons name="send" size={24} color={COLORS.tertiary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ChatbotAssistantBottomSheet;
