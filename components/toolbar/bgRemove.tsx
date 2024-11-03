"use client";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { bgRemoval } from "@/server/bg-remove";
import { Image } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function BgRemove() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant={"outline"} className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs">
            Bg Removal <Image size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3>Background Removal</h3>
          <p className="text-sm text-muted-foreground">
            Remove the background of an image with one simple click
          </p>
        </div>
        <Button
          disabled={!activeLayer.url || generating}
          className="w-full mt-4"
          onClick={async () => {
            const newLayerId = crypto.randomUUID();
            setGenerating(true);
            const res = await bgRemoval({
              format: activeLayer.format!, // Ensure these are correctly passed
              activeImage: activeLayer.publicId!, // Pass the publicId
            });
            if (res?.data?.success) {
              // Update to match the server response structure
              console.log("Background removal successful");
              addLayer({
                id: newLayerId,
                url: res.data.success,
                height: activeLayer.height,
                width: activeLayer.width,
                publicId: activeLayer.publicId,
                name: "Rem_" + activeLayer.name,
                resourceType: "image",
                format: "png",
              });
              setActiveLayer(newLayerId);
              setGenerating(false);
            }
            if (res?.serverError) {
              setGenerating(false);
              console.error("Error:", res.serverError);
            }
          }}
        >
          {generating ? "Removing..." : "Remove background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
