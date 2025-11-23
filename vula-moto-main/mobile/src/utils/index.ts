import { ReactNativeFile } from "apollo-upload-client";
import * as Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as StoreReview from "expo-store-review";
import * as Updates from "expo-updates";
import mime from "mime";
import { Alert } from "react-native";
import * as rnMimeTypes from "react-native-mime-types";

export const onImpact = async () =>
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

export const rateApp = async () => {
  const available = await StoreReview.isAvailableAsync();
  if (available) {
    const hasAction = await StoreReview.hasAction();
    if (hasAction) {
      await StoreReview.requestReview();
    }
  }
};
export const onFetchUpdateAsync = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    Alert.alert(
      Constants.default.name,
      error as any,
      [{ text: "OK", style: "destructive" }],
      { cancelable: false }
    );
  }
};

export const generateRNFile = ({
  uri,
  name,
}: {
  uri: string;
  name: string;
}) => {
  return uri
    ? new ReactNativeFile({
        uri,
        type: rnMimeTypes.lookup(uri) || "image",
        name,
      })
    : null;
};

export const sendPushNotification = async (token: string) => {
  const message = {
    to: token,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export const getMimeType = (url: string) => mime.getType(url) || undefined;
export const downloadMedia = async (url: string) => {
  const fileName = mime.getExtension(getMimeType(url)!) || "fileName-img.jpg";
  const downloadPath = FileSystem.cacheDirectory + fileName;
  const { uri } = await FileSystem.downloadAsync(url, downloadPath);

  return {
    uri,
  };
};
export const shareSomething = async (url: string, dialogTitle: string) => {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) return;
  const { uri } = await downloadMedia(url);
  await Sharing.shareAsync(uri, {
    dialogTitle,
    UTI: getMimeType(url),
    mimeType: getMimeType(url),
  });
};

export const saveImageToLibrary = async (url: string) => {
  const isAvailable = await MediaLibrary.isAvailableAsync();
  if (!isAvailable) return;
  const { uri } = await downloadMedia(url);
  await MediaLibrary.saveToLibraryAsync(uri).then(() =>
    Alert.alert("Image Saved", "The profile image was saved to library.")
  );
};
