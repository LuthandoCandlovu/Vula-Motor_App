import { COLORS, FONTS } from "@/src/constants";
import { useMediaPermissions } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { TAttachmentMessageInput } from "@/src/types";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
  onShouldSend: (message: string) => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  onNewAttachment: (attachment: TAttachmentMessageInput) => void;
  sending: boolean;
}

const MessageInput = ({
  onShouldSend,
  onNewAttachment,
  sending,
  message,
  setMessage,
}: Props) => {
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);
  const inputRef = React.useRef<TextInput>(null);

  const { settings } = useSettingsStore();
  const { camera, gallery, requestCameraPermission } = useMediaPermissions();
  const expandItems = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    expanded.value = withTiming(1, { duration: 400 });
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };
  const expandButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      expanded.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const width = interpolate(
      expanded.value,
      [0, 1],
      [30, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      width,
    };
  });

  const buttonViewStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expanded.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP
    );
    return {
      width,
      opacity: expanded.value,
    };
  });

  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const onSend = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    onShouldSend(message);
  };

  const record = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  const select = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (gallery) {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        base64: true,
      });

      if (canceled) return;
      const [asset] = assets;
      onNewAttachment({
        base64: "data:image/jpeg;base64," + asset.base64,
        type: "image",
        uri: asset.uri,
      });
    }
  };
  const take = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (camera) {
      const { assets, canceled } = await ImagePicker.launchCameraAsync({
        quality: 1,
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        base64: true,
      });
      if (canceled) return;
      const [asset] = assets;
      onNewAttachment({
        base64: "data:image/jpeg;base64," + asset.base64,
        type: "image",
        uri: asset.uri,
      });
    } else {
      await requestCameraPermission();
    }
  };

  const selectFile = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const [asset] = result.assets;
    onNewAttachment({
      type: "document",
      uri: asset.uri,
    });
  };

  return (
    <BlurView
      intensity={90}
      tint="extraLight"
      style={{
        paddingBottom: bottom,
        paddingTop: 10,
      }}
    >
      <View style={styles.row}>
        <ATouchableOpacity
          onPress={expandItems}
          style={[styles.roundBtn, expandButtonStyle]}
        >
          <Ionicons name="add" size={24} color={COLORS.tertiary} />
        </ATouchableOpacity>

        <Animated.View style={[styles.buttonView, buttonViewStyle]}>
          <TouchableOpacity onPress={take}>
            <Ionicons name="camera-outline" size={24} color={COLORS.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={select}>
            <Ionicons name="image-outline" size={24} color={COLORS.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={selectFile}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={COLORS.tertiary}
            />
          </TouchableOpacity>
        </Animated.View>

        <TextInput
          autoFocus
          ref={inputRef}
          placeholder="Message"
          style={styles.messageInput}
          onFocus={collapseItems}
          onChangeText={onChangeText}
          value={message}
          multiline
          placeholderTextColor={COLORS.black}
          selectionColor={COLORS.tertiary}
        />
        {sending ? (
          <ActivityIndicator
            size={20}
            color={COLORS.secondary}
            shouldRasterizeIOS
          />
        ) : message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons
              name="arrow-up-circle"
              size={30}
              color={COLORS.tertiary}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled onPress={record}>
            <Ionicons name="mic" size={30} color={COLORS.tertiary} />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.main,
    paddingTop: 10,
    height: 60,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: Platform.select({
      ios: 8,
      android: 5,
    }),
    borderColor: "lightgray",
    backgroundColor: COLORS.white,
    fontFamily: FONTS.bold,
    maxHeight: "100%",
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
export default MessageInput;
