"use client";

import { ModeToggle } from "@/components/theme/mode-toggle";
import ActiveImage from "./ActiveImage";
import Layers from "./layers/layers";
import UploadForm from "./upload/UploadForm";

export default function Editor() {
  return (
    <div className="flex h-full">
      <div className="py-6 px-4 basis-[240px] shrink-0">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
      </div>
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}
