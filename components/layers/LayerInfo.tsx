"use client";

import { Layer, useLayerStore } from "@/lib/layer-store";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function LayerInfo({
  layer,
  layerIndex,
}: {
  layer: Layer;
  layerIndex: number;
}) {
  const layers = useLayerStore((state) => state.layers);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const removeLayer = useLayerStore((state) => state.removeLayer);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <EllipsisIcon size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-medium text-center mb-2">
          Layer {layer.id}
        </DialogTitle>
        <div className="py-4 space-y-0">
          <p>
            <span className="font-bold">Filename:</span>
            {layer.name}
          </p>
          <p>
            <span className="font-bold">Format:</span>
            {layer.format}
          </p>
          <p>
            <span className="font-bold">Size:</span>
            {layer.width}X{layer.height}
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setActiveLayer(layerIndex === 0 ? layers[1].id : layers[0].id);
            removeLayer(layer.id);
          }}
        >
          <span>Remove Layer</span>
          <Trash2 size={16} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
