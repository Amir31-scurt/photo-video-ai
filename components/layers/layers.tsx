"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { ArrowRight, Images, Layers2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LayerImage from "./layer-image";
import LayerInfo from "./LayerInfo";

export default function Layers() {
  const layers = useLayerStore((state) => state.layers);
  const activeLayers = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const generating = useImageStore((state) => state.generating);
  const layerComparaisonMode = useLayerStore(
    (state) => state.layerComparaisonMode
  );
  const setLayerComparaisonMode = useLayerStore(
    (state) => state.setLayerComparaisonMode
  );
  const comparedLayers = useLayerStore((state) => state.comparedLayers);
  const toggleComparedLayer = useLayerStore(
    (state) => state.toggleComparedLayer
  );
  const setComparedLayers = useLayerStore((state) => state.setComparedLayers);

  const getLayerName = useMemo(
    () => (id: string) => {
      const layer = layers.find((l) => l.id === id);
      return layer ? layer.url : "Nothing here";
    },
    [layers]
  );

  const visibleLayers = useMemo(
    () =>
      layerComparaisonMode
        ? layers.filter((layer) => layer.url && layer.resourceType === "image")
        : layers,
    [layerComparaisonMode, layers]
  );

  return (
    <Card
      className="basis-[360px] shrink-0 scrollbar-thin scrollbar-track-secpndary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full 
    scrollbar-track rounded-md overflow-x-hidden relative flex flex-col shadow-2xl"
    >
      <CardHeader className="sticky top-0 z-50 px-4 py-6 min-h-24 bg-card shadow-sm">
        {layerComparaisonMode ? (
          <div>
            <CardTitle className="text-sm pb-2">Comparing ...</CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <Image
                alt="compare"
                width={32}
                height={32}
                src={getLayerName(comparedLayers[0]) as string}
              />
              {comparedLayers.length > 0 && <ArrowRight />}
              {comparedLayers.length > 1 ? (
                <Image
                  alt="compare"
                  width={32}
                  height={32}
                  src={getLayerName(comparedLayers[1]) as string}
                />
              ) : (
                "Nothing here"
              )}
            </CardDescription>
          </div>
        ) : null}
        <div>
          <CardTitle className="text-sm">
            {activeLayers?.name || "Layers"}
          </CardTitle>
          {activeLayers.width && activeLayers.height ? (
            <CardDescription>
              {activeLayers.width} x {activeLayers.height}
            </CardDescription>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {visibleLayers.map((layer, index) => (
          <div
            className={`cursor-pointer ease-in-out hover:bg-secondary rounded-md ${
              generating && "animate-pulse"
            } ${
              activeLayers.id === layer.id ||
              (comparedLayers.includes(layer.id) && "border border-primary")
            }`}
            key={layer.id}
            onClick={() => {
              if (generating) return;
              if (layerComparaisonMode) {
                toggleComparedLayer(layer.id);
              } else {
                setActiveLayer(layer.id);
              }
            }}
          >
            <div className="relative p-4 flex items-center">
              <div className="flex gap-2 items-center h-8 w-full justify-between">
                {!layer.url ? (
                  <p className="text-xs font-medium justify-self-end">
                    New Layer
                  </p>
                ) : null}
                <LayerImage layer={layer} />
                <LayerInfo layer={layer} layerIndex={index} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="sticky bottom-0 bg-card flex gap-2 shrink-0 p-4 mt-4">
        <Button
          onClick={() => {
            addLayer({
              id: crypto.randomUUID(),
              url: "",
              height: 0,
              width: 0,
              publicId: "",
              name: "",
              format: "",
            });
          }}
          className="w-full flex gap-2"
          variant={"outline"}
        >
          <span>Create Layer</span>
          <Layers2 className="text-secondary-foreground" size={18} />
        </Button>
        <Button
          disabled={!activeLayers.url || activeLayers.resourceType === "video"}
          onClick={() => {
            if (layerComparaisonMode) {
              setLayerComparaisonMode(!layerComparaisonMode);
            } else {
              setComparedLayers([activeLayers.id]);
            }
          }}
          variant={"outline"}
          className="w-full flex gap-2"
        >
          <span>
            {layerComparaisonMode ? "stop comparing" : "Compare Layers"}
          </span>
          {!layerComparaisonMode && (
            <Images className="text-secondary-foreground" size={14} />
          )}
        </Button>
      </div>
    </Card>
  );
}
