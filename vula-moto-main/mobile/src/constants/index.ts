export const SERVER_BASE_URL = "http://10.20.62.129:3001";

export const LANGUAGE_OPTIONS = [
  { id: 0, name: "English", value: "en" },
  { id: 1, name: "isiXhosa", value: "xh" },
  { id: 2, name: "isiZulu", value: "zu" },
  { id: 3, name: "Afrikaans", value: "af" },
  { id: 4, name: "Sesotho", value: "st" },
];

export const COLORS = {
  main: "#F1F0E4",
  primary: "#BCA88D",
  secondary: "#7D8D86",
  tertiary: "#3E3F29",
  black: "#000000",
  white: "#ffffff",
  red: "#FB2576",
  gray: "#758694",
  transparent: "transparent",
  gray100: "#DDDDDD",
  gray200: "#7F8CAA",
  google: "#4285F4",
  facebook: "#017FFE",
};

export const DELIVERY_OPTIONS = [
  { id: 0, name: "Collect", value: "collect" },
  { id: 1, name: "Delivery", value: "delivery" },
];

export const AUDIOS = {
  published: require("@/assets/sounds/published.mp3"),
};

export const Fonts = {
  "JosefinSans-Bold": require("@/assets/fonts/JosefinSans-Bold.ttf"),
  "JosefinSans-Regular": require("@/assets/fonts/JosefinSans-Regular.ttf"),
};
export const FONTS = {
  regular: "JosefinSans-Regular",
  bold: "JosefinSans-Bold",
};

export const STORAGE_NAME = {
  ME: "vulamoto:me",
  SETTINGS: "vulamoto:settings",
  LOCATION: "vulamoto:location",
  WISHLIST: "vulamoto:wishlist",
};

export const APP_NAME = "Vula Moto";

export const relativeTimeObject = {
  future: "in %s",
  past: "%s",
  s: "now",
  m: "1m",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "1d",
  dd: "%dd",
  M: "1M",
  MM: "%dM",
  y: "1y",
  yy: "%dy",
};

export const LANDING_MESSAGES = [
  {
    id: 1,
    image: require("@/assets/images/3.png"),
    title: "Welcome to Vula Moto!",
    message:
      "Your tools, your trade — we're here to help you connect with more customers and grow your auto business, faster and smarter.",
  },
  {
    id: 2,
    image: require("@/assets/images/1.png"),
    title: "Built for Local Mechanics and Spares Shops",
    message:
      "Whether you fix engines, install tyres, or sell parts — Vula Moto puts your business on the map for people near you.",
  },
  {
    id: 3,
    image: require("@/assets/images/2.png"),
    title: "List Parts. Offer Services. Get Bookings.",
    message:
      "Upload your spares and services, set your prices, and let customers book you directly from their phones.",
  },
  {
    id: 4,
    image: require("@/assets/images/0.png"),
    title: "Fix. Sell. Succeed.",
    message:
      "From small repairs to big jobs — Vula Moto helps you grow your hustle and reach more customers who value your work.",
  },
];
