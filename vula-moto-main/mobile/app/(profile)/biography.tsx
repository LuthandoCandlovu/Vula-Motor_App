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
import { useMutation, useQuery } from "convex/react";
import { Keyboard } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const Page = () => {
  const { me } = useMeStore();
  const user = useQuery(api.api.users.getById, {
    id: me?._id,
  });
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const updateMutation = useMutation(api.api.users.updateBio);

  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    biography: "",
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
    if (!!!me) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      await updateMutation({
        biography: state.biography.trim(),
        id: me._id,
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
    if (!!user) {
      setState((s) => ({
        ...s,
        biography: user?.biography || "",
      }));
    }
  }, [user]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile Biography",
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
      <Spinner visible={state.loading} animation="fade" />
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
            Edit Profile Biography
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
                text={state.biography}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, biography: text }))
                }
                multiline
                leftIcon={
                  <Ionicons name="list-outline" size={18} color={COLORS.gray} />
                }
                editable={state.edit}
                inputStyle={{ fontSize: 16, fontFamily: FONTS.bold }}
                containerStyles={{
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingVertical: 5,
                  maxHeight: 100,
                }}
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
            </Card>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Page;
