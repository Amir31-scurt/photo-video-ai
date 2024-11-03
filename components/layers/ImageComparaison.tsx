"use client";
import { Layer } from "@/lib/layer-store";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export default function ImageComparaison({ layers }: { layers: Layer[] }) {
  if (layers.length === 0) {
    return <p>No layers to compare</p>;
  }
  if (layers.length === 1) {
    return (
      <div className="h-full">
        <ReactCompareSliderImage
          src={layers[0].url || ""}
          srcSet={layers[0].url || ""}
          alt={layers[0].name || "Single Image"}
          className="rounded-lg object-contain"
        />
      </div>
    );
  }
  return (
    <div>
      <ReactCompareSlider
        className="h-full object-contain"
        itemOne={
          <ReactCompareSliderImage
            src={layers[0].url || ""}
            srcSet={layers[0].url || ""}
            alt={layers[0].name || "Layer 1"}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={layers[1].url || ""}
            srcSet={layers[1].url || ""}
            alt={layers[1].name || "Layer 2"}
          />
        }
      ></ReactCompareSlider>
    </div>
  );
}
