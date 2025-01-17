"use client";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { useLayerStore } from "@/lib/layer-store";
import ActiveImage from "./ActiveImage";
import Layers from "./layers/layers";
import ImageTools from "./toolbar/ImageToolbar";
import UploadForm from "./upload/UploadForm";

export default function Editor() {
  const activeLayer = useLayerStore((state) => state.activeLayer);

  return (
    <div className="flex h-full">
      <div className="py-6 px-4 basis-[240px] shrink-0">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-4">
          {activeLayer.resourceType === "image" ? <ImageTools /> : null}
        </div>
      </div>
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}
