import Button from "@/src/components/Button/Button";
import TextInput from "@/src/components/TextInput/TextInput";
import { COLORS, FONTS } from "@/src/constants";
import { useWarmUpBrowser } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useAuth, useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();
const Page = () => {
  useWarmUpBrowser();
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    error: "",
    email: "",
    password: "",
    showPassword: false,
    loading: false,
  });

  const onSignIn = async () => {
    if (settings.haptics) {
      await onImpact();
    }

    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      error: "",
      loading: true,
    }));
    try {
      const signInAttempt = await signIn.create({
        identifier: state.email,
        password: state.password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error:
            signInAttempt.status === "needs_first_factor"
              ? "Please complete the first factor of authentication."
              : "Sign-in failed. Please try again.",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error: error.longMessage,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          error: "Failed to sign in. Please try again.",
          loading: false,
        }));
      }
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace({
        pathname: "/(tabs)/home",
      });
    }
  }, [isSignedIn]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.main,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{
            flex: 1,
          }}
          bounces={false}
        >
          <View style={{ padding: 20, paddingTop: 40, flexDirection: "row" }}>
            <Animated.Image
              source={require("@/assets/images/adaptive-icon.png")}
              style={{
                width: 100,
                height: 100,
              }}
              entering={SlideInLeft.duration(400).delay(200)}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
                Reset Password
              </Text>
              <Animated.Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                  color: COLORS.black,
                }}
              >
                Hello, Welcome back!
              </Animated.Text>
            </View>
          </View>

          <View style={styles.row}>
            <TextInput
              label="Email Address"
              placeholder="johndoe@gmail.com"
              onChangeText={(text) => setState((s) => ({ ...s, email: text }))}
              text={state.email}
              outerContainerStyles={{
                flex: 1,
              }}
              containerStyles={{
                paddingHorizontal: 20,
              }}
              leftIcon={
                <Ionicons name="mail" color={COLORS.gray200} size={20} />
              }
              keyboardType="email-address"
            />
          </View>

          <View style={styles.row}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                color: COLORS.black,
              }}
            >
              Enter your email address and we'll send you instructions to reset
              your password.
            </Text>
          </View>

          <View
            style={[
              styles.row,
              { justifyContent: "flex-start", width: "100%" },
            ]}
          >
            <Text
              style={{
                color: COLORS.red,
                marginTop: 10,
                fontFamily: FONTS.regular,
                fontSize: 16,
              }}
            >
              {state.error}
            </Text>
          </View>
          <View style={styles.row}>
            <Button
              style={{
                width: "100%",
                maxWidth: 450,
                marginVertical: 20,
                backgroundColor: COLORS.tertiary,
                borderColor: COLORS.tertiary,
              }}
              title="Send Reset Password Code"
              onPress={onSignIn}
              loading={state.loading}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Page;

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingHorizontal: 20,
    alignSelf: "center",
    maxWidth: 450,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    width: "100%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
});
