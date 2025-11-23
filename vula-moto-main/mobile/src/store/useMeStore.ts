import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { zustandStorage } from "./storage";

interface TMe {
  firstName: string | null;
  lastName: string | null;
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  imageUrl: string;
  lastLoginAt: Date | null;
  email: string;
  _id: Id<"users">;
}

interface TMeState {
  me: TMe | null;
  save: (me: TMe | null) => void;
  destroy: () => void;
}

export const useMeStore = create<TMeState>()(
  persist(
    (set, _get) => ({
      me: null,
      save: (me) => set({ ..._get(), me }),
      destroy: () => set({ ..._get(), me: null }),
    }),
    {
      name: STORAGE_NAME.ME,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
