import * as Location from "expo-location";

type AType = {
  city: string | null;
  country: string | null;
  district: string | null;
  isoCountryCode: string | null;
  name: string | null;
  postalCode: string | null;
  region: string | null;
  street: string | null;
  streetNumber: string | null;
};
export const getLocationAddress = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<AType> => {
  try {
    const res = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const [
      {
        city,
        country,
        district,

        isoCountryCode,
        name,
        postalCode,
        region,
        street,
        streetNumber,
      },
    ] = res;
    return {
      city,
      country,
      district,
      isoCountryCode,
      name,
      postalCode,
      region,
      street,
      streetNumber,
    };
  } catch (error) {
    return {
      city: null,
      country: null,
      district: null,
      isoCountryCode: null,
      name: null,
      postalCode: null,
      region: null,
      street: null,
      streetNumber: null,
    };
  }
};
