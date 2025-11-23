import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { api } from "@/convex/_generated/api";
import TextInput from "@/src/components/TextInput/TextInput";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { Keyboard } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const PersonalInformation = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const updateMutation = useMutation(api.api.users.update);
  const { me } = useMeStore();
  const { isLoaded, isSignedIn } = useAuth();
  const { settings } = useSettingsStore();
  const { user } = useUser();
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    loading: false,
    edit: false,
    error: "",
  });
  const editable = useSharedValue(0);
  const editButtonStyle = useAnimatedStyle(() => {
    const width = withTiming(interpolate(editable.value, [0, 1], [100, 0]));
    const height = withTiming(interpolate(editable.value, [0, 1], [45, 0]));
    const marginBottom = withTiming(
      interpolate(editable.value, [0, 1], [10, 0])
    );
    const paddingVertical = withTiming(
      interpolate(editable.value, [0, 1], [8, 0])
    );
    return {
      width,
      height,
      marginBottom,
      paddingVertical,
    };
  });
  const saveButtonStyle = useAnimatedStyle(() => {
    const height = withTiming(interpolate(editable.value, [0, 1], [0, 45]));
    const marginBottom = withTiming(
      interpolate(editable.value, [0, 1], [0, 10])
    );
    const paddingVertical = withTiming(
      interpolate(editable.value, [0, 1], [0, 8])
    );

    const backgroundColor = withTiming(
      interpolateColor(
        editable.value,
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

  const save = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!user || !!!me) return;
    setState((s) => ({ ...s, loading: true }));
    if (state.firstName.trim().length < 3 || state.lastName.trim().length < 3) {
      return setState((s) => ({
        ...s,
        error: "First name and Last name are required.",
        loading: false,
        edit: false,
      }));
    }

    try {
      await user.update({
        lastName: state.lastName.trim(),
        firstName: state.firstName.trim(),
      });
      await updateMutation({
        id: me._id,
        values: {
          email: me.email,
          firstName: state.firstName,
          lastName: state.lastName,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
        edit: false,
      }));
    }
  };

  React.useEffect(() => {
    editable.value = state.edit ? 1 : 0;
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
        firstName: me.firstName!,
        lastName: me.lastName!,
      }));
    }
  }, [me]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Personal Information",
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
          headerStyle: {
            backgroundColor: COLORS.tertiary,
          },
        }}
      />
      <Spinner visible={state.loading || !isLoaded} animation="fade" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={100}
          behavior={Platform.select({
            ios: "padding",
            default: "height",
          })}
          style={{
            padding: 10,
            paddingBottom: 100,
            paddingTop: Platform.select({
              ios: headerHeight + 50,
              default: 10,
            }),
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Edit Personal Information
          </Text>
          <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
            <Card
              style={{
                padding: 10,
                maxWidth: 500,
                borderRadius: 5,
                width: "100%",
                paddingVertical: 20,
                alignSelf: "flex-start",
              }}
            >
              <AnimatedTouchableOpacity
                onPress={save}
                style={[
                  saveButtonStyle,
                  {
                    borderRadius: 5,
                    alignItems: "center",
                    maxWidth: 400,
                  },
                ]}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                  }}
                >
                  Save
                </Text>
              </AnimatedTouchableOpacity>
              <AnimatedTouchableOpacity
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  setState((s) => ({ ...s, edit: true }));
                }}
                style={[
                  editButtonStyle,
                  {
                    alignSelf: "flex-end",
                    backgroundColor: COLORS.secondary,
                    borderRadius: 5,
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                  }}
                >
                  Edit
                </Text>
              </AnimatedTouchableOpacity>
              <TextInput
                placeholder="First Name"
                keyboardType="default"
                text={state.firstName}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, firstName: text }))
                }
                leftIcon={
                  <Ionicons name="person" size={18} color={COLORS.gray} />
                }
                editable={state.edit}
                inputStyle={{ fontSize: 16, fontFamily: FONTS.bold }}
                containerStyles={{
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingVertical: 5,
                }}
              />
              <TextInput
                placeholder="Last Name"
                keyboardType="default"
                text={state.lastName}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, lastName: text }))
                }
                leftIcon={
                  <Ionicons name="person" size={18} color={COLORS.gray} />
                }
                inputStyle={{ fontSize: 16, fontFamily: FONTS.bold }}
                containerStyles={{
                  borderRadius: 0,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  paddingVertical: 5,
                }}
                editable={state.edit}
              />
              <Text
                style={{
                  color: COLORS.red,
                  marginVertical: 5,
                  fontFamily: FONTS.regular,
                }}
              >
                {state.error}
              </Text>

              <TouchableOpacity
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  router.navigate({
                    pathname: "/(profile)/biography",
                  });
                }}
                style={[
                  {
                    borderRadius: 5,
                    alignItems: "center",
                    maxWidth: 400,
                    backgroundColor: COLORS.secondary,
                    padding: 8,
                  },
                ]}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                  }}
                >
                  Edit Bio
                </Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default PersonalInformation;
