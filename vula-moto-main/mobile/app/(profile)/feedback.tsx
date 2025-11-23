import { api } from "@/convex/_generated/api";
import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
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
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const Page = () => {
  const router = useRouter();
  const { settings } = useSettingsStore();

  const [state, setState] = React.useState({
    loading: false,
    feedback: "",
  });
  const createMutation = useMutation(api.api.feedbacks.create);
  const reasonValue = useSharedValue(0);
  const animatedButtonStyle = useAnimatedStyle(() => {
    const height = withTiming(interpolate(reasonValue.value, [0, 1], [0, 45]));
    const marginBottom = withTiming(
      interpolate(reasonValue.value, [0, 1], [0, 10])
    );
    const paddingVertical = withTiming(
      interpolate(reasonValue.value, [0, 1], [0, 5])
    );
    const backgroundColor = withTiming(
      interpolateColor(
        reasonValue.value,
        [0, 1],
        [COLORS.tertiary, COLORS.secondary]
      )
    );
    return {
      backgroundColor,
      height,
      marginBottom,
      paddingVertical,
    };
  });

  const sendFeedback = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (state.feedback.trim().length === 0) return;
    setState((s) => ({ ...s, loading: true }));
    const { success } = await createMutation({ feedback: state.feedback });
    if (success) {
      Alert.alert(
        "Success",
        "Thank you for your feedback! We will do everything in our power to improve our app.",
        [
          {
            text: "OK",
            onPress: () => {
              setState((s) => ({ ...s, loading: false, feedback: "" }));
              router.back();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Failed",
        "Failed to give the feedback at the moment try again."
      );
      setState((s) => ({ ...s, loading: false }));
    }
  };
  React.useEffect(() => {
    reasonValue.value = state.feedback.trim().length === 0 ? 0 : 1;
  }, [state]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Send us Feedback",
          headerLargeTitle: false,
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
      <Spinner visible={state.loading} animation="fade" />

      <View style={{ flex: 1, backgroundColor: COLORS.main }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={100}
            behavior={Platform.select({
              ios: "padding",
              android: "height",
            })}
            style={{
              padding: 10,
              paddingBottom: 100,
              paddingTop: 10,
              backgroundColor: COLORS.main,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                marginBottom: 10,
                maxWidth: 500,
                alignSelf: "flex-start",
              }}
            >
              We value your opinion and would love to hear your thoughts about
              Vula Moto. Please take your time to share your feedback with us.
              Your input helps us improve the app to better meet the needs of
              our valued users. Rest assured, all feedback is anonymous.
            </Text>
            <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
              <Card
                style={{
                  padding: 10,
                  maxWidth: 500,
                  alignSelf: "flex-start",
                  borderRadius: 5,
                  width: "100%",
                  paddingVertical: 20,
                }}
              >
                <TextInput
                  style={{
                    paddingVertical: 5,
                    padding: 10,
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                    backgroundColor: COLORS.main,
                    height: 100,
                    textAlignVertical: "top",
                    maxHeight: 100,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                  }}
                  value={state.feedback}
                  multiline
                  placeholder="Feedback"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text) =>
                    setState((s) => ({ ...s, feedback: text }))
                  }
                  onSubmitEditing={sendFeedback}
                />
                <AnimatedTouchableOpacity
                  onPress={sendFeedback}
                  style={[
                    animatedButtonStyle,
                    {
                      borderRadius: 5,
                      alignItems: "center",
                      maxWidth: 400,
                      marginTop: 20,
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
                    Send Feedback
                  </Text>
                </AnimatedTouchableOpacity>
              </Card>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default Page;
