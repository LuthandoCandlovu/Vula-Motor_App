import * as Camera from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React from "react";

export const useMediaPermissions = () => {
  const [permission, requestCameraPermission] = Camera.useCameraPermissions();

  const [permissions, setPermisions] = React.useState({
    camera: false,
    gallery: false,
    requestCameraPermission: () => {},
  });
  React.useEffect(() => {
    (async () => {
      const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (granted) {
        setPermisions((state) => ({
          ...state,
          gallery: granted,
        }));
      } else {
        const { granted: g } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermisions((state) => ({
          ...state,
          gallery: g,
        }));
      }
    })();
  }, []);

  React.useEffect(() => {
    setPermisions((state) => ({
      ...state,
      camera: !!permission?.granted,
      requestCameraPermission: requestCameraPermission,
    }));
  }, [permission]);
  return permissions;
};
