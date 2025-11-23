import { COLORS } from "@/src/constants";
import { TAttachmentMessageInput } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Animated, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

const MessageAttachment = ({
  attachment,
  onRemove,
  uploading,
}: {
  attachment: TAttachmentMessageInput;
  onRemove: () => void;
  uploading: boolean;
}) => {
  return (
    <BlurView
      intensity={80}
      style={{
        padding: 5,
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 210,
        alignSelf: "center",
        borderRadius: 10,
      }}
    >
      <TouchableOpacity
        disabled={uploading}
        style={{
          width: 20,
          height: 20,
          borderRadius: 20,
          backgroundColor: COLORS.red,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          alignSelf: "flex-end",
        }}
        onPress={onRemove}
      >
        <Ionicons name="close-outline" size={16} color={COLORS.white} />
      </TouchableOpacity>
      {attachment.type === "image" ? (
        <Animated.Image
          source={{ uri: attachment.uri! }}
          style={{ width: 200, height: 200 }}
        />
      ) : attachment.type === "document" ? (
        <WebView
          originWhitelist={["*"]}
          style={{ width: 200, height: 200 }}
          source={{ uri: attachment.uri! }}
        />
      ) : (
        <Text>Audio not supported for now.</Text>
      )}
    </BlurView>
  );
};

export default MessageAttachment;
