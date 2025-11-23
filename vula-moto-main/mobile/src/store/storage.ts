import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

export const zustandStorage: StateStorage = {
  getItem: async (key) => {
    try {
      const v = await AsyncStorage.getItem(key);
      return v;
    } catch (error) {
      return null;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  },
};
