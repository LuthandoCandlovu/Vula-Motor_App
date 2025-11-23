import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { zustandStorage } from "./storage";

interface TWishlist {
  wishlist: Id<"items">[];
  save: (wishlist: Id<"items">[]) => void;
  clear: () => void;
}

export const useWishlistStore = create<TWishlist>()(
  persist(
    (set, _get) => ({
      wishlist: [],
      save: (wishlist) => set({ ..._get(), wishlist }),
      clear: () => set({ ..._get(), wishlist: [] }),
    }),
    {
      name: STORAGE_NAME.WISHLIST,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
