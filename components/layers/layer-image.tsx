"use client";

import { Layer } from "@/lib/layer-store";
import Image from "next/image";

export default function LayerImage({ layer }: { layer: Layer }) {
  if (layer.url) {
    return (
      <div className="w-12 h-12 flex items-center justify-between gap-3">
        <Image
          className="w-full object-contain h-full rounded-sm"
          alt={layer.name ?? "Unknown image"}
          src={layer.format === "mp4" ? layer.poster || layer.url : layer.url}
          width={50}
          height={50}
        />
        <div>
          <p className="text-xs">
            {`${layer.name?.slice(0, 15)}.${layer.format}`}
          </p>
        </div>
      </div>
    );
  }
  return <div></div>;
}
