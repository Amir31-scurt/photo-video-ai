"use client";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { genRemove } from "@/server/GenRemove";
import { Eraser } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function GenRemove() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const [activeTag, setActiveTag] = useState("");

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant={"outline"} className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs">
            Content Aware <Eraser size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3>Smart AI remove</h3>
          <p className="text-sm text-muted-foreground">
            Generative remove any part of the image
          </p>
        </div>
        <div className="grid grid-col-3 items-center gap-4">
          <Label htmlFor="selection">Selection</Label>
          <Input
            className="col-span-2 h-8"
            value={activeTag}
            onChange={(e) => setActiveTag(e.target.value)}
          />
        </div>
        <Button
          className="w-full mt-4"
          onClick={async () => {
            const newLayerId = crypto.randomUUID();
            setGenerating(true);
            const res = await genRemove({
              prompt: activeTag,
              activeImage: activeLayer.url!,
            });
            if (res?.data?.success) {
              setGenerating(false);
              addLayer({
                id: newLayerId,
                url: res.data.success,
                height: activeLayer.height,
                width: activeLayer.width,
                publicId: activeLayer.publicId,
                name: "Rem_" + activeLayer.name,
                resourceType: "image",
                format: activeLayer.format,
              });
              setActiveLayer(newLayerId);
            } else {
              setGenerating(false);
              console.error("Failed to generate genRemove");
            }
          }}
        >
          Magic remove
        </Button>
      </PopoverContent>
    </Popover>
  );
}
