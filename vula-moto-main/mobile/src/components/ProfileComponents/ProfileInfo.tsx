import { TUser } from "@/convex/tables/users";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import UserBiographyBottomSheet from "../BottomSheets/UserBiographyBottomSheet";
import Card from "../Card/Card";
import ContentLoader from "../ContentLoader/ContentLoader";
import Button from "../Button/Button";
import { useRouter } from "expo-router";
import { useMeStore } from "@/src/store/useMeStore";

const ProfileInfo = ({ user }: { user?: TUser | null }) => {
  const { settings } = useSettingsStore();
  const bioBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const router = useRouter();
  const { me } = useMeStore();
  if (!!!user)
    return (
      <Animated.View
        style={{
          marginTop: 50,
        }}
        entering={SlideInRight.duration(400).delay(400)}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ContentLoader
            style={{
              borderRadius: 3,
              padding: 5,
              width: "100%",
              marginBottom: 4,
            }}
          />
          <ContentLoader
            style={{
              borderRadius: 3,
              padding: 5,
              width: "50%",
              marginBottom: 4,
              alignSelf: "flex-start",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ContentLoader
              style={{
                borderRadius: 5,
                padding: 20,
                width: 100,
                marginBottom: 4,
              }}
            />
            <ContentLoader
              style={{
                borderRadius: 5,
                padding: 20,
                width: 100,
                marginBottom: 4,
              }}
            />
          </View>
        </Card>
      </Animated.View>
    );
  return (
    <Animated.View
      style={{
        marginTop: 50,
      }}
      entering={SlideInRight.duration(400).delay(400)}
    >
      <UserBiographyBottomSheet
        biography={user.biography || ""}
        ref={bioBottomSheetRef}
      />
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            {
              fontFamily: FONTS.bold,
              fontSize: 14,
              width: "100%",
              height: 50,
            },
          ]}
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            bioBottomSheetRef.current?.present();
          }}
        >
          {user.biography}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Button
            title={"Profile Reviews"}
            style={{
              width: "100%",
              backgroundColor: COLORS.tertiary,
            }}
            onPress={() =>
              router.navigate({
                pathname: "/(common)/reviews",
                params: {
                  id: user._id,
                },
              })
            }
          />
        </View>
      </Card>
    </Animated.View>
  );
};

export default ProfileInfo;
