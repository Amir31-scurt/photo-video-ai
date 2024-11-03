import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import Image from "next/image";
import ImageComparaison from "./layers/ImageComparaison";

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const layers = useLayerStore((state) => state.layers);
  const layerComparaisonMode = useLayerStore(
    (state) => state.layerComparaisonMode
  );

  const comparedLayers = useLayerStore((state) => state.comparedLayers);

  if (!activeLayer.url && comparedLayers.length === 0) return null;

  const renderLayer = (layer: Layer) => (
    <div className="relative w-full h-full flex items-center justify-center">
      {layer.resourceType === "image" && (
        <Image
          src={layer.url!}
          alt={layer.name!}
          fill
          className={`rounded-lg object-contain ${
            generating ? "animate-pulse" : ""
          }`}
        />
      )}
      {layer.resourceType === "video" && (
        <video
          width={layer.width}
          height={layer.height}
          controls
          className="rounded-lg object-contain max-w-full max-h-full"
          src={layer.transciptionURL || layer.url}
        />
      )}
    </div>
  );

  if (layerComparaisonMode && comparedLayers.length > 0) {
    const comparaisonLayers = comparedLayers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean) as Layer[];
    return (
      <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
        <ImageComparaison layers={comparaisonLayers} />
      </div>
    );
  }

  return (
    <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  );
}
