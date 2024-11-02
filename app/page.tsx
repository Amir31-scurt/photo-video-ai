"use client";

import Editor from "@/components/editor";
import { ImageStore } from "@/lib/image-store";
import { LayerStorage } from "@/lib/layer-store";

export default function Home() {
  return (
    <LayerStorage.Provider
      initialValue={{
        layerComparaisonMode: false,
        layers: [
          {
            id: crypto.randomUUID(),
            url: "",
            height: 0,
            width: 0,
            publicId: "",
          },
        ],
      }}
    >
      <ImageStore.Provider initialValue={{ generating: false }}>
        <main className="h-full">
          <Editor />
        </main>
      </ImageStore.Provider>
    </LayerStorage.Provider>
  );
}
