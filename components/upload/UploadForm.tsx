"use client";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";
import UploadImage from "./upload-Image";

export default function UploadForm() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const [selectedType, setSelectedType] = useState("image");

  console.log(activeLayer);

  if (!activeLayer.url) {
    return (
      <div className="w-full p-24 flex flex-col justify-center h-full">
        {selectedType === "image" ? <UploadImage /> : null}
      </div>
    );
  }
}
