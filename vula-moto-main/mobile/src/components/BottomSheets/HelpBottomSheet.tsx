import { APP_NAME, COLORS, FONTS, LANGUAGE_OPTIONS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { translateText } from "@/src/utils/react-query";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const initialText =
  "Vula Moto connects local sellers with nearby buyers by using location-based services, smart product recommendations, and real-time communication tools. When users launch the app, it detects their location to show nearby listings — from fresh produce and livestock to automotive spares and services. The app recommends products using three filtering methods: demographic filtering (based on what users like or search for), content-based filtering (suggesting similar items using product details and location), and collaborative filtering (using patterns from users with similar behavior). Buyers can chat with sellers directly in real time, negotiate prices, and save items to their wishlist — helping improve future suggestions. Push notifications alert users to new listings and promotions, making the experience fast, local, and community-driven.";
const HelpBottomSheet = React.forwardRef<BottomSheetModal, {}>(({}, ref) => {
  const snapPoints = React.useMemo(() => ["50%"], []);
  const { dismiss } = useBottomSheetModal();
  const { settings } = useSettingsStore();
  const language = React.useMemo(
    () => LANGUAGE_OPTIONS.find((l) => l.value === settings.lang)!,
    [settings]
  );

  const { mutateAsync, isPending, data } = useMutation({
    mutationKey: ["translate-text"],
    mutationFn: translateText,
    networkMode: "offlineFirst",
  });

  const [text, setText] = React.useState(initialText);
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
            How does Vula Moto works?
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 18,
            }}
          >
            {text}
          </Text>

          <View>
            <TouchableOpacity
              disabled={isPending}
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 30,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                mutateAsync({ text: text, to: settings.lang }).then((data) => {
                  if (data.success) {
                    setText(data.translation!);
                  }
                  if (!!data.error) {
                    Alert.alert(
                      APP_NAME,
                      data.error,
                      [
                        {
                          style: "default",
                          text: "OK",
                          onPress: async () => {
                            if (settings.haptics) {
                              await onImpact();
                            }
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                });
              }}
            >
              {isPending ? (
                <ActivityIndicator size={"small"} color={COLORS.tertiary} />
              ) : null}
              <MaterialIcons
                name="translate"
                size={24}
                color={COLORS.tertiary}
              />
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                  color: COLORS.tertiary,
                }}
              >
                Translate to {language.name}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: COLORS.gray,
              }}
            >
              You can change the default translation language in the settings.
            </Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default HelpBottomSheet;
