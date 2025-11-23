import { TChat } from "@/convex/tables/chats";
import { TItem } from "@/convex/tables/items";
import { TUser } from "@/convex/tables/users";

export type TLanguage = "en" | "xh" | "zu" | "af" | "st";

export type TProduct = {
  productId: string;
  productName: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: {
    url: string;
    alt: string;
  };
  seller: {
    sellerId: string;
    name: string;
    rating: number;
    contactEmail: string;
  };
};

export type TAttachment = {
  base64: string | undefined | null;
  type: string | undefined | null;
  uri: string | undefined | null;
};

export type TAttachmentMessageInput = {
  type: "document" | "image" | "audio";
  uri: string;
  base64?: string;
};

export type TChatExpanded = TChat & {
  buyer: TUser | null;
  seller: TUser | null;
  item: TItem | null;
};
export type TLocation = {
  lat: number;
  lon: number;
  address: {
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
};

export type TTab<T> = {
  icon: string;
  id: T;
  name: string;
};
