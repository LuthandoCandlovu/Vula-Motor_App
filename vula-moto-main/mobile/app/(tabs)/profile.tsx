import { api } from "@/convex/_generated/api";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onFetchUpdateAsync, onImpact, rateApp } from "@/src/utils";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackActions } from "@react-navigation/native";
import { useQuery } from "convex/react";
import * as Constants from "expo-constants";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import HelpBottomSheet from "@/src/components/BottomSheets/HelpBottomSheet";
import PPBottomSheet from "@/src/components/BottomSheets/PPBottomSheet";
import TnCBottomSheet from "@/src/components/BottomSheets/TnCBottomSheet";
import Card from "@/src/components/Card/Card";
import ProfileCard from "@/src/components/ProfileCard/ProfileCard";
import SettingItem from "@/src/components/SettingItem/SettingItem";
import { useMeStore } from "@/src/store/useMeStore";
import LanguageTranslationSettingComponent from "@/src/components/LanguageTranslationSettingComponent/LanguageTranslationSettingComponent";
import NewUserBottomSheet from "@/src/components/BottomSheets/NewUserBottomSheet";

const Page = () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { settings } = useSettingsStore();
  const { destroy } = useMeStore();
  const tnCBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const ppBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const helpBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const userBiographyBottomSheet = React.useRef<BottomSheetModal>(null);
  const newUserBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const { me } = useMeStore();
  const [loading, setLoading] = React.useState(false);

  const user = useQuery(api.api.users.getById, {
    id: me?._id,
  });
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  React.useEffect(() => {
    if (!!user && !!!user.biography?.trim().length) {
      userBiographyBottomSheet.current?.present();
    }
  }, [user]);

  const logout = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setLoading(true);
    await signOut().finally(() => {
      destroy();

      setLoading(false);
      if (router.canGoBack()) {
        navigation.dispatch(StackActions.popToTop());
      }
      setTimeout(() => {
        router.replace({
          pathname: "/",
        });
      }, 1);
    });
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: headerHeight,
        backgroundColor: COLORS.main,
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <TnCBottomSheet ref={tnCBottomSheetRef} />
      <PPBottomSheet ref={ppBottomSheetRef} />
      <HelpBottomSheet ref={helpBottomSheetRef} />
      <ProfileCard isLoading={!isLoaded} />
      <NewUserBottomSheet ref={newUserBottomSheetRef} />
      <Text style={styles.headerText}>Settings</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/pi");
          }}
          title="Personal Information"
          Icon={
            <Ionicons name="person-outline" size={18} color={COLORS.black} />
          }
        />

        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            newUserBottomSheetRef.current?.present();
          }}
          title="User Privileges"
          Icon={<Feather name="user-check" size={18} color={COLORS.black} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/security");
          }}
          title="Account and Security"
          Icon={
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.black}
            />
          }
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/notifications");
          }}
          title="Notifications"
          Icon={
            <Ionicons
              name="notifications-outline"
              size={18}
              color={COLORS.black}
            />
          }
        />
      </Card>

      <Text style={styles.headerText}>Misc</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            await onFetchUpdateAsync();
          }}
          title="Check for Updates"
          Icon={<MaterialIcons name="update" size={18} color={COLORS.black} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/sound-haptics");
          }}
          title="App Sound and Haptics"
          Icon={
            <MaterialIcons name="vibration" size={18} color={COLORS.black} />
          }
        />
        <LanguageTranslationSettingComponent />
      </Card>

      <Text style={styles.headerText}>Support</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.navigate("/(profile)/feedback");
          }}
          title="Give us Feedback"
          Icon={
            <MaterialIcons name="feedback" size={18} color={COLORS.black} />
          }
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            await Share.share(
              {
                url: "https://github.com/CrispenGari/vula-moto",
                message:
                  "An awesome application that connect automotive services seekers and offers: Download at https://github.com/CrispenGari/vula-moto",
                title: "Share Vula Moto with a Friend",
              },
              { dialogTitle: "Share Vula Moto", tintColor: COLORS.tertiary }
            );
          }}
          title="Tell a friend"
          Icon={
            <Ionicons name="heart-outline" size={18} color={COLORS.black} />
          }
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            await rateApp();
          }}
          title="Rate Vula Moto"
          Icon={<Ionicons name="star-outline" size={18} color={COLORS.black} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            helpBottomSheetRef.current?.present();
          }}
          title="How does Vula Moto works"
          Icon={<Ionicons name="help" size={18} color={COLORS.black} />}
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            const res = await Linking.canOpenURL(
              "https://github.com/CrispenGari/vula-moto/issues"
            );
            if (res) {
              Linking.openURL(
                "https://github.com/CrispenGari/vula-moto/issues"
              );
            }
          }}
          title="Report an Issue"
          Icon={<Ionicons name="logo-github" size={18} color={COLORS.black} />}
        />
      </Card>
      <Text style={styles.headerText}>Legal</Text>
      <Card
        style={{
          marginHorizontal: 10,
          paddingVertical: 10,
          paddingHorizontal: 0,
          maxWidth: "100%",
        }}
      >
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            tnCBottomSheetRef.current?.present();
          }}
          title="Terms of Service"
          Icon={
            <Ionicons
              name="document-text-outline"
              size={18}
              color={COLORS.black}
            />
          }
        />
        <SettingItem
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            ppBottomSheetRef.current?.present();
          }}
          title="Privacy Policy"
          Icon={
            <Ionicons
              name="document-text-outline"
              size={18}
              color={COLORS.black}
            />
          }
        />
      </Card>

      <TouchableOpacity
        style={{
          alignSelf: "center",
          marginTop: 20,
          flexDirection: "row",
          gap: 5,
        }}
        onPress={logout}
        disabled={loading}
      >
        <ActivityIndicator size={"small"} color={COLORS.red} />
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: COLORS.red,
            textDecorationLine: "underline",
            fontSize: 16,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: FONTS.bold,
          color: COLORS.black,
          padding: 10,
          textAlign: "center",
        }}
      >
        {Constants.default.expoConfig?.name}
        {" version: "}
        {Constants.default.expoConfig?.version}
      </Text>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
  },
});
