import * as Location from "expo-location";
import React from "react";

export const useLocationPermission = () => {
  const [granted, setGranted] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (granted) {
        setGranted(granted);
      } else {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (granted) {
          setGranted(granted);
        }
      }
    })();
  }, []);

  return {
    granted,
  };
};
