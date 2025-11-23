import { APP_NAME, COLORS, FONTS } from "@/src/constants";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Animated, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const scale = React.useRef(new Animated.Value(0.5)).current;
  const opacity = React.useRef(new Animated.Value(0.5)).current;
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3.4,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    const timeoutInterVal = setTimeout(() => {
      if (isLoaded && !isSignedIn) {
        router.replace({
          pathname: "/(auth)/landing",
        });
      } else {
        router.replace({
          pathname: "/(tabs)/home",
        });
      }
    }, 3000);
    return () => {
      clearTimeout(timeoutInterVal);
    };
  }, [isLoaded, isSignedIn]);

  return (
    <ImageBackground
      style={{
        flex: 1,
      }}
      source={require("@/assets/images/bg.jpg")}
      blurRadius={8}
    >
      <SafeAreaView
        style={{
          flex: 1,
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",

            backgroundColor: COLORS.white,
            borderRadius: 10,
            padding: 10,
            transform: [{ scale }],
          }}
        >
          <Animated.Image
            source={require("@/assets/images/icon.png")}
            style={{
              width: 200,
              height: 150,
              borderRadius: 10,
              objectFit: "contain",
            }}
          />
          <Animated.Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 25,
              color: COLORS.black,
              transform: [{ scale }],
            }}
          >
            {APP_NAME}
          </Animated.Text>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Page;
