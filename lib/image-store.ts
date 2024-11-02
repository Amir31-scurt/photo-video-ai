import React from "react";
import { useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { createZustandContext } from "./zustand-context";

type State = {
  generating: boolean;
  setGenerating: (generating: boolean) => void;
};
const getStore = (initialState: { generating: boolean }) => {
  return createStore<State>()(
    persist(
      (set) => ({
        generating: initialState.generating,
        setGenerating: (generating: boolean) => set({ generating }),
      }),
      { name: "image-store", storage: createJSONStorage(() => localStorage) }
    )
  );
};

export const ImageStore = createZustandContext(getStore);

export function useImageStore<T>(selector: (state: State) => T) {
  const store = React.useContext(ImageStore.Context);
  if (!store) {
    throw new Error("Missing Image store provider");
  }
  return useStore(store, selector);
}
