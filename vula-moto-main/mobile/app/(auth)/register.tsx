import TnCBottomSheet from "@/src/components/BottomSheets/TnCBottomSheet";
import Button from "@/src/components/Button/Button";
import Divider from "@/src/components/Divider/Divider";
import TextInput from "@/src/components/TextInput/TextInput";
import { COLORS, FONTS } from "@/src/constants";
import { useWarmUpBrowser } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useAuth, useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Checkbox } from "expo-checkbox";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();
const Page = () => {
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const tnCBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    error: "",
    email: "",
    password: "",
    showPassword: false,
    loading: false,
    firstName: "",
    lastName: "",
    confirmPassword: "",
    tnc: false,
  });

  const onSignUp = async () => {
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

  const facebook = React.useCallback(async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      loading: true,
    }));
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_facebook",
        redirectUrl: Linking.createURL("/", { scheme: "vulamoto" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
        }));
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error_msg: error.longMessage,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          error_msg: "Failed to create an account.",
          loading: false,
        }));
      }
    }
  }, []);
  const google = React.useCallback(async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      loading: true,
    }));
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/", { scheme: "vulamoto" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
        }));
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error_msg: error.longMessage,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          error_msg: "Failed to create an account.",
          loading: false,
        }));
      }
    }
  }, []);

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace({
        pathname: "/(tabs)/home",
      });
    }
  }, [isSignedIn]);
  return (
    <>
      <TnCBottomSheet ref={tnCBottomSheetRef} />
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
            <View
              style={{
                padding: 20,
                paddingTop: 40,
                flexDirection: "row",
                alignSelf: "center",
                maxWidth: 400,
                width: "100%",
              }}
            >
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
                  Sign Up
                </Text>
                <Animated.Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    color: COLORS.black,
                  }}
                >
                  Hello, Welcome!
                </Animated.Text>
              </View>
            </View>

            <View style={styles.row}>
              <TextInput
                label="First Name"
                placeholder="John"
                onChangeText={(text) =>
                  setState((s) => ({ ...s, firstName: text }))
                }
                text={state.firstName}
                outerContainerStyles={{
                  flex: 1,
                }}
                containerStyles={{
                  paddingHorizontal: 20,
                }}
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    color={COLORS.gray200}
                    size={20}
                  />
                }
                keyboardType="default"
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                onChangeText={(text) =>
                  setState((s) => ({ ...s, lastName: text }))
                }
                text={state.lastName}
                outerContainerStyles={{
                  flex: 1,
                }}
                containerStyles={{
                  paddingHorizontal: 20,
                }}
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    color={COLORS.gray200}
                    size={20}
                  />
                }
                keyboardType="default"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="Email Address"
                placeholder="johndoe@gmail.com"
                onChangeText={(text) =>
                  setState((s) => ({ ...s, email: text }))
                }
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
              <TextInput
                label="Password"
                placeholder="Password"
                onChangeText={(text) =>
                  setState((s) => ({ ...s, password: text }))
                }
                text={state.password}
                outerContainerStyles={{
                  flex: 1,
                }}
                inputStyle={{ paddingHorizontal: 20 }}
                secureTextEntry={!state.showPassword}
                leftIcon={
                  <Ionicons
                    name="lock-closed"
                    color={COLORS.gray200}
                    size={20}
                  />
                }
                rightIcon={
                  <Ionicons
                    name={state.showPassword ? "eye" : "eye-off"}
                    color={COLORS.gray200}
                    size={20}
                  />
                }
                onRightIconPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  setState((s) => ({
                    ...s,
                    showPassword: !s.showPassword,
                  }));
                }}
                containerStyles={{
                  paddingHorizontal: 20,
                }}
                onSubmitEditing={onSignUp}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                label="Confirm Password"
                placeholder="Confirm Password"
                onChangeText={(text) =>
                  setState((s) => ({ ...s, confirmPassword: text }))
                }
                text={state.confirmPassword}
                outerContainerStyles={{
                  flex: 1,
                }}
                inputStyle={{ paddingHorizontal: 20 }}
                secureTextEntry={!state.showPassword}
                leftIcon={
                  <Ionicons
                    name="lock-closed"
                    color={COLORS.gray200}
                    size={20}
                  />
                }
                rightIcon={
                  <Ionicons
                    name={state.showPassword ? "eye" : "eye-off"}
                    color={COLORS.gray200}
                    size={20}
                  />
                }
                onRightIconPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  setState((s) => ({
                    ...s,
                    showPassword: !s.showPassword,
                  }));
                }}
                containerStyles={{
                  paddingHorizontal: 20,
                }}
                onSubmitEditing={onSignUp}
              />
            </View>

            <View
              style={[
                styles.row,
                {
                  paddingVertical: 10,
                  marginHorizontal: 5,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Checkbox
                  value={state.tnc}
                  onValueChange={(tnc) => setState((s) => ({ ...s, tnc }))}
                  color={COLORS.tertiary}
                />
                <TouchableOpacity
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    setState((s) => ({ ...s, tnc: !s.tnc }));
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 18,
                    }}
                  >
                    I agree to the{" "}
                    <Text
                      style={{
                        color: COLORS.tertiary,
                        textDecorationLine: "underline",
                      }}
                      onPress={async () => {
                        if (settings.haptics) {
                          await onImpact();
                        }
                        tnCBottomSheetRef.current?.present();
                      }}
                    >
                      Terms and Conditions.
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
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
                  marginVertical: 10,
                  backgroundColor: COLORS.tertiary,
                  borderColor: COLORS.tertiary,
                }}
                title="Sign In"
                onPress={onSignUp}
                loading={state.loading}
              />
            </View>
            <View style={[styles.row, { marginVertical: 10 }]}>
              <Divider
                position="center"
                title="OR"
                titleStyles={{ color: COLORS.black }}
              />
            </View>
            <View
              style={[
                {
                  gap: 10,
                  padding: 30,
                  alignSelf: "center",
                  maxWidth: 400,
                  width: "100%",
                },
              ]}
            >
              <TouchableOpacity
                disabled={state.loading}
                activeOpacity={0.7}
                style={[
                  styles.btn,
                  {
                    elevation: 0,
                    borderColor: COLORS.google,
                  },
                ]}
                onPress={google}
              >
                <Image
                  source={require("../../assets/images/google.png")}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.black,
                    fontSize: 18,
                  }}
                >
                  Sign Up with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={state.loading}
                activeOpacity={0.7}
                style={[
                  styles.btn,
                  {
                    elevation: 0,
                    borderColor: COLORS.facebook,
                    backgroundColor: COLORS.facebook,
                  },
                ]}
                onPress={facebook}
              >
                <Ionicons name="logo-facebook" size={24} color={COLORS.white} />
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    color: COLORS.white,
                    fontSize: 18,
                  }}
                >
                  Sign Up with Facebook
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.row,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                },
              ]}
            >
              <Link href="/(auth)/login" asChild>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                    color: COLORS.black,
                  }}
                >
                  I have an account?{" "}
                  <Text
                    style={{
                      color: COLORS.tertiary,
                    }}
                  >
                    Sign In.
                  </Text>
                </Text>
              </Link>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
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
