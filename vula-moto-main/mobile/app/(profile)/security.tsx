import Card from "@/src/components/Card/Card";
import TextInput from "@/src/components/TextInput/TextInput";

import { COLORS, FONTS } from "@/src/constants";
import { useLocationStore } from "@/src/store/locationStore";

import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { useWishlistStore } from "@/src/store/useWishlist";
import { onImpact } from "@/src/utils";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Link, Stack, useRouter } from "expo-router";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Animated, {
  interpolate,
  interpolateColor,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Security = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { destroy } = useMeStore();
  const { reset } = useLocationStore();
  const { clear } = useWishlistStore();
  const { settings } = useSettingsStore();
  const { me } = useMeStore();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [state, setState] = React.useState({
    email: "",
    currentPassword: "",
    loading: false,
    editEmail: false,
    editPassword: false,
    passwordError: "",
    emailError: "",
    confirmNewPassword: "",
    newPassword: "",
    showCurrentPassword: false,
  });
  const editablePassword = useSharedValue(0);
  const editableEmail = useSharedValue(0);

  const editPasswordButtonStyle = useAnimatedStyle(() => {
    const width = withTiming(
      interpolate(editablePassword.value, [0, 1], [100, 0])
    );
    const height = withTiming(
      interpolate(editablePassword.value, [0, 1], [40, 0])
    );
    const marginBottom = withTiming(
      interpolate(editablePassword.value, [0, 1], [10, 0])
    );
    const paddingVertical = withTiming(
      interpolate(editablePassword.value, [0, 1], [8, 0])
    );
    return {
      width,
      height,
      marginBottom,
      paddingVertical,
    };
  });
  const savePasswordButtonStyle = useAnimatedStyle(() => {
    const height = withTiming(
      interpolate(editablePassword.value, [0, 1], [0, 40])
    );
    const marginBottom = withTiming(
      interpolate(editablePassword.value, [0, 1], [0, 10])
    );
    const paddingVertical = withTiming(
      interpolate(editablePassword.value, [0, 1], [0, 8])
    );
    const backgroundColor = withTiming(
      interpolateColor(
        editablePassword.value,
        [0, 1],
        [COLORS.tertiary, COLORS.tertiary]
      )
    );
    return {
      backgroundColor,
      height,
      marginBottom,
      paddingVertical,
    };
  });

  const savePassword = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!me || !!!user) return;
    setState((s) => ({ ...s, loading: true }));
    if (state.newPassword !== state.confirmNewPassword) {
      return setState((s) => ({
        ...s,
        passwordError: "The two password must match.",
        currentPassword: "",
        newPassword: "",
        editPassword: false,
        confirmNewPassword: "",
        loading: false,
      }));
    }

    user
      .updatePassword({
        newPassword: state.newPassword,
        currentPassword: state.currentPassword,
        signOutOfOtherSessions: true,
      })
      .then((res) => {
        // the password has been updated
        setState((s) => ({
          ...s,
          passwordError: "",
          currentPassword: "",
          newPassword: "",
          editPassword: false,
          confirmNewPassword: "",
          loading: false,
        }));

        signOut().then(() => {
          destroy();
          reset();
          clear();
          router.replace("/login");
        });
      })
      .catch((error) => {
        return setState((s) => ({
          ...s,
          passwordError: error.errors[0].message,
          currentPassword: "",
          newPassword: "",
          editPassword: false,
          confirmNewPassword: "",
          loading: false,
        }));
      });
  };

  React.useEffect(() => {
    editablePassword.value = state.editPassword ? 1 : 0;
    editableEmail.value = state.editEmail ? 1 : 0;
  }, [state]);

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);

  React.useEffect(() => {
    if (!!me) {
      setState((s) => ({
        ...s,
        email: me.email,
      }));
    }
  }, [me]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Account and Security",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
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

          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold, color: COLORS.white },
          headerStyle: { backgroundColor: COLORS.tertiary },
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.main,
        }}
      >
        <Spinner visible={state.loading || !isLoaded} animation="fade" />
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            keyboardVerticalOffset={10}
            behavior={Platform.select({ ios: "padding" })}
            style={{
              padding: 10,
              paddingTop: Platform.select({
                android: 10,
                ios: headerHeight + 20,
              }),
              flex: 1,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Change Email
              </Text>
              <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
                <Card
                  style={{
                    padding: 10,
                    maxWidth: 500,
                    alignSelf: "flex-start",
                    borderRadius: 5,
                    width: "100%",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      color: COLORS.tertiary,
                      marginBottom: 5,
                    }}
                  >
                    Your email address can not be changed.
                  </Text>
                  <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    text={state.email}
                    onChangeText={(text) =>
                      setState((state) => ({ ...state, email: text }))
                    }
                    leftIcon={
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color={COLORS.gray}
                      />
                    }
                    editable={state.editEmail}
                    inputStyle={{ fontSize: 16, fontFamily: FONTS.bold }}
                    containerStyles={{
                      borderRadius: 5,
                      paddingVertical: 5,
                    }}
                  />
                </Card>
              </Animated.View>

              <Link
                asChild
                href={{
                  pathname: "/(profile)/delete",
                }}
              >
                <TouchableOpacity
                  style={{ alignSelf: "center", marginTop: 100 }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      color: COLORS.red,
                      textDecorationLine: "underline",
                      fontSize: 16,
                    }}
                  >
                    Delete Account
                  </Text>
                </TouchableOpacity>
              </Link>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default Security;
