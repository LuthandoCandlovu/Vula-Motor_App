import "react-native-reanimated";
///
import { api } from "@/convex/_generated/api";
import { TNotification } from "@/convex/tables/notifications";
import { Fonts } from "@/src/constants";
import { useCurrentLocation } from "@/src/hooks";
import ClerkProvider from "@/src/providers/ClerkProvider";
import ConvexProvider from "@/src/providers/ConvexProvider";
import ReactQueryProvider from "@/src/providers/ReactQueryProvider";
import { useLocationStore } from "@/src/store/locationStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { useWishlistStore } from "@/src/store/useWishlist";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/src/utils/notifications";
import { useUser } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "convex/react";
import Constants from "expo-constants";
import { loadAsync } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
LogBox.ignoreLogs;
LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Layout = () => {
  const keys = React.useMemo(
    () =>
      [
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_URL,
        Constants.expoConfig?.extra?.CONVEX_DEPLOYMENT,
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_SITE,
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
        Constants.expoConfig?.extra?.GOOGLE_MAPS_APIKEY,
      ].filter(Boolean),
    []
  );

  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await loadAsync(Fonts);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  if (keys.length !== 5)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Missing {keys.length - 5} keys.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" />

      <ReactQueryProvider>
        <ConvexProvider>
          <ClerkProvider>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <RootLayout />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </ClerkProvider>
        </ConvexProvider>
      </ReactQueryProvider>
    </View>
  );
};

export default Layout;

const RootLayout = () => {
  const currentLocation = useCurrentLocation();
  const createUserOrFailMutation = useMutation(
    api.api.users.findUserOrCreateOne
  );

  const router = useRouter();
  const { settings } = useSettingsStore();
  const updateUserLocation = useMutation(api.api.users.updateLocation);
  const { user, isSignedIn } = useUser();
  const { save, me } = useMeStore();
  const { save: updateLocation } = useLocationStore();
  const { save: loadWishlist } = useWishlistStore();
  const notifications = useQuery(api.api.notifications.one, {
    id: me?._id,
  });
  const wishlist = useQuery(api.api.users.getMyWishList, {
    id: me?.id || "",
  });
  React.useEffect(() => {
    if (!!currentLocation.lat) {
      updateLocation(currentLocation);
      updateUserLocation({
        id: me?._id,
        location: {
          lat: currentLocation.lat,
          lon: currentLocation.lon,
        },
      });
    }
  }, [currentLocation]);

  React.useEffect(() => {
    if (typeof wishlist !== "undefined") {
      loadWishlist(wishlist);
    }
  }, [wishlist]);
  React.useEffect(() => {
    if (!isSignedIn) {
      save(null);
    }
    (async () => {
      if (!!user) {
        const me = {
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          imageUrl: user.imageUrl,
          lastLoginAt: user.lastSignInAt,
          email: user.emailAddresses[0].emailAddress,
        };
        const res = await createUserOrFailMutation({
          email: me.email,
          firstName: me.firstName || "",
          id: me.id,
          image: me.imageUrl,
          lastName: me.lastName || "",
          bookmarks: [],
          ratting: [5],
          new: true,
        });
        if (!!res._id) {
          save({
            ...me,
            _id: res._id,
          });
        }
      } else {
        save(null);
      }
    })();
  }, [user, isSignedIn]);

  React.useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (!!token && settings.notifications && !!me) {
        if (notifications) {
          const not = notifications as TNotification;
          sendPushNotification(
            token,
            not.title,
            not.body,
            undefined,
            undefined,
            not
          );
        }
      }
    });
  }, [me, settings, notifications]);

  React.useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (_notification) => {}
    );
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((_response) => {
        console.log(_response);
        //  router.navigate({
        //    pathname: "/(chat)/[chatId]",
        //    params:{
        //     chatId: ''
        //    }
        //  });
      });
    return () => {
      responseListener.remove();
      notificationListener.remove();
    };
  }, []);
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};
