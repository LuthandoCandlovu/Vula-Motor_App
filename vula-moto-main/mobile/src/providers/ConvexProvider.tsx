import { ConvexReactClient, ConvexProvider as Provider } from "convex/react";
import Constants from "expo-constants";
import React from "react";
const convex = new ConvexReactClient(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_URL!,
  {
    unsavedChangesWarning: false,
  }
);
const ConvexProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider client={convex}>{children}</Provider>;
};

export default ConvexProvider;
