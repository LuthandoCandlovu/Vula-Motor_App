import { useSettingsStore } from "@/src/store/settingsStore";
import { TLocation } from "@/src/types";
import { getLocationAddress } from "@/src/utils/address";
import * as Location from "expo-location";
import React from "react";
import { useLocationPermission } from "../";

export const useCurrentLocation = () => {
  const { granted } = useLocationPermission();
  const {
    settings: { location },
  } = useSettingsStore();
  const [state, setState] = React.useState<TLocation>({
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
  });

  React.useEffect(() => {
    (async () => {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: location.locationAccuracy,
      });
      if (coords) {
        setState((s) => ({
          ...s,
          lat: coords.latitude,
          lon: coords.longitude,
        }));
      }
      const address = await getLocationAddress({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setState((s) => ({
        ...s,
        lat: coords.latitude,
        lon: coords.longitude,
        address,
      }));
    })();
  }, [granted, location]);

  return state;
};
