import { ClerkProvider as Provider } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import React from "react";
import { tokenCache } from "../utils/cache";

const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      tokenCache={tokenCache}
      publishableKey={
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
      }
    >
      {children}
    </Provider>
  );
};

export default ClerkProvider;
