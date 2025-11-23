import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { TLocation } from "../types";
import { zustandStorage } from "./storage";

interface TLocationState {
  location: TLocation;
  save: (location: TLocation) => void;
  reset: () => void;
}
const initialState = {
  lat: 51.507351,
  lon: -0.127758,
  address: {
    city: null,
    country: null,
    district: null,
    isoCountryCode: null,
    name: null,
    postalCode: null,
    region: null,
    street: null,
    streetNumber: null,
  },
} satisfies TLocation;

export const useLocationStore = create<TLocationState>()(
  persist(
    (set, _get) => ({
      location: initialState,
      save: (location) => set({ ..._get(), location }),
      reset: () => set({ ..._get(), location: initialState }),
    }),
    {
      name: STORAGE_NAME.LOCATION,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
