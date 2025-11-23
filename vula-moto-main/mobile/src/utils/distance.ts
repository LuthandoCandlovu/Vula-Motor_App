import { getDistance } from "geolib";

export type TCoord = {
  latitude: number;
  longitude: number;
};

export const calculateDistance = (from: TCoord, to: TCoord): string => {
  const distanceInMeters = getDistance(from, to);
  if (distanceInMeters < 1000) {
    return `${distanceInMeters} m`;
  } else {
    const distanceInKm = (distanceInMeters / 1000).toFixed(0);
    return `${distanceInKm} km`;
  }
};
