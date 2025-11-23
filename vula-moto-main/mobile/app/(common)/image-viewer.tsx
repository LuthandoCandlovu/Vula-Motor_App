import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact, saveImageToLibrary, shareSomething } from "@/src/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({ loading: false });
  const [loaded, setLoaded] = React.useState(true);
  const { uri, title } = useLocalSearchParams<{
    uri: string;
    title: string;
  }>();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const share = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!uri) return;
    setState((s) => ({ ...s, loading: true }));
    await shareSomething(uri, "Sharing Image");
    setState((s) => ({ ...s, loading: false }));
  };
  const save = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!uri) return;
    setState((s) => ({ ...s, loading: true }));
    saveImageToLibrary(uri);
    setState((s) => ({ ...s, loading: false }));
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          presentation: Platform.select({ android: "transparentModal" }),
          headerShadowVisible: false,
          headerTitle: title || "Profile Picture",
          headerTransparent: true,

          headerBackground: () => (
            <BlurView
              tint="dark"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
          headerTitleStyle: { fontFamily: FONTS.bold, color: COLORS.white },
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ),
        }}
      />

      <RootSiblingParent>
        <BlurView
          intensity={100}
          tint="dark"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ImageZoom
            onError={(_error) => {
              setLoaded(true);
            }}
            onLoad={() => {
              setLoaded(true);
            }}
            uri={uri}
            minScale={0.7}
            maxScale={5}
            doubleTapScale={2}
            isSingleTapEnabled
            isDoubleTapEnabled
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          <BlurView
            intensity={95}
            tint={"light"}
            style={{ paddingBottom: bottom, width: "100%" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 30,
                gap: 50,
              }}
            >
              <TouchableOpacity style={styles.iconBtn} onPress={save}>
                <MaterialIcons name="download" size={24} color={COLORS.black} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={share}>
                <MaterialIcons
                  name="ios-share"
                  size={24}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          </BlurView>
        </BlurView>
      </RootSiblingParent>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  iconBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: COLORS.gray100,
  },
});
