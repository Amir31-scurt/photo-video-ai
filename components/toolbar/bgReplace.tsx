"use client";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { bgReplace } from "@/server/bg-replace";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function BgReplace() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const [prompt, setPrompt] = useState("");

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant={"outline"} className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs">
            Bg Replace <ImageOff size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3>Generative Background Replace</h3>
          <p className="text-sm text-muted-foreground">
            Replace the background of your image with AI generated content.
          </p>
        </div>
        <div className="grid grid-col-3 items-center gap-4">
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            className="col-span-2 h-8"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the new background"
          />
        </div>
        <Button
          disabled={!activeLayer.url || generating}
          className="w-full mt-4"
          onClick={async () => {
            const newLayerId = crypto.randomUUID();
            setGenerating(true);

            try {
              const res = await bgReplace({
                prompt: prompt,
                activeImage: activeLayer.url!,
              });

              if (res?.data?.success) {
                console.log(
                  "Background replacement successful:",
                  res.data.success
                );
                addLayer({
                  id: newLayerId,
                  url: res.data.success,
                  height: activeLayer.height,
                  width: activeLayer.width,
                  publicId: activeLayer.publicId,
                  name: "bg-replaced_" + activeLayer.name,
                  resourceType: "image",
                  format: activeLayer.format,
                });
                setActiveLayer(newLayerId);
              } else if (res?.serverError) {
                console.error("Server error:", res.serverError);
              }
            } catch (error) {
              console.error("Client error:", error);
            } finally {
              setGenerating(false);
            }
          }}
        >
          {generating ? "Generating..." : "Replace background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
