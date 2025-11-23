module.exports = {
  expo: {
    name: "Vula Moto",
    slug: "vulamoto",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "vulamoto",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.crispengari.vulamoto",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#271818ff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "1982a0cf-64fa-49c3-9af3-653c07fb7c60",
      },
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
      EXPO_PUBLIC_CONVEX_SITE: process.env.EXPO_PUBLIC_CONVEX_SITE,
      CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
      GOOGLE_MAPS_APIKEY: process.env.GOOGLE_MAPS_APIKEY,
    },
  },
};
