import React from "react";
import { useStore } from "zustand";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { createZustandContext } from "./zustand-context";

export type Layer = {
  publicId?: string;
  width?: number;
  height?: number;
  url?: string;
  id: string;
  name?: string;
  type?: string;
  format?: string;
  poster?: string;
  resourceType?: string;
  transciptionURL?: string;
};

type State = {
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  activeLayer: Layer;
  updateLayer: (layer: Layer) => void;
  setPoster: (id: string, posterUrl: string) => void;
  setTranscriptionURL: (id: string, transcriptionUrl: string) => void;
  layerComparaisonMode: boolean;
  setLayerComparaisonMode: (mode: boolean) => void;
  comparedLayers: string[];
  setComparedLayers: (layers: string[]) => void;
  toggleComparedLayer: (id: string) => void;
};

const getStore = (initialState: {
  layers: Layer[];
  layerComparaisonMode: boolean;
}) => {
  return createStore<State>()(
    persist(
      (set) => ({
        layers: initialState.layers,
        addLayer: (layer: Layer) =>
          set((state) => ({ layers: [...state.layers, layer] })),
        removeLayer: (id: string) =>
          set((state) => ({
            layers: state.layers.filter((layer) => layer.id !== id),
          })),
        setActiveLayer: (id: string) =>
          set((state) => ({
            activeLayer: state.layers.find((layer) => layer.id === id),
          })),
        activeLayer: initialState.layers[0],
        updateLayer: (layer: Layer) =>
          set((state) => ({
            layers: state.layers.map((l) => (l.id === layer.id ? layer : l)),
          })),
        setPoster: (id: string, posterUrl: string) =>
          set((state) => ({
            layers: state.layers.map((l) =>
              l.id === id ? { ...l, poster: posterUrl } : l
            ),
          })),
        setTranscriptionURL: (id: string, transcriptionUrl: string) =>
          set((state) => ({
            layers: state.layers.map((l) =>
              l.id === id ? { ...l, transciptionURL: transcriptionUrl } : l
            ),
          })),
        layerComparaisonMode: initialState.layerComparaisonMode,
        setLayerComparaisonMode: (mode: boolean) =>
          set(() => ({
            layerComparaisonMode: mode,
            comparedLayers: mode ? [] : [],
          })),
        comparedLayers: [],
        setComparedLayers: (layers: string[]) =>
          set(() => ({
            comparedLayers: layers,
            layerComparaisonMode: layers.length > 0,
          })),
        toggleComparedLayer: (id: string) =>
          set((state) => {
            const newComparedLayers = state.comparedLayers.includes(id)
              ? state.comparedLayers.filter((layerId) => layerId !== id)
              : [...state.comparedLayers, id].slice(-2);
            return {
              comparedLayers: newComparedLayers,
              layerComparaisonMode: newComparedLayers.length > 0,
            };
          }),
      }),
      { name: "layer-storage" }
    )
  );
};

export const LayerStorage = createZustandContext(getStore);

export function useLayerStore<T>(selector: (state: State) => T) {
  const store = React.useContext(LayerStorage.Context);
  if (!store) {
    throw new Error("Missing Layer store provider");
  }
  return useStore(store, selector);
}
