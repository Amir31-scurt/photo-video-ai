import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { uploadImage } from "@/server/upload-image";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";

export default function UploadImage() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/webp": [".webp"],
    },
    onDrop: async (acceptedFiles, FileRejections) => {
      if (acceptedFiles.length) {
        const formData = new FormData();
        formData.append("image", acceptedFiles[0]);
        const objectURL = URL.createObjectURL(acceptedFiles[0]);
        setGenerating(true);

        updateLayer({
          id: activeLayer.id,
          url: objectURL,
          width: 0,
          height: 0,
          name: "uploading",
          publicId: "",
          format: "",
          resourceType: "image",
        });

        setActiveLayer(activeLayer.id);
        // Upload the image
        const res = await uploadImage({ image: formData });
        if (res?.data?.success) {
          updateLayer({
            id: activeLayer.id,
            url: res.data.success.url,
            width: res.data.success.width,
            height: res.data.success.height,
            name: res.data.success.original_filename,
            publicId: res.data.success.public_id,
            format: res.data.success.format,
            resourceType: res.data.success.resource_type,
          });
          setActiveLayer(activeLayer.id);
          setGenerating(false);
        }
        if (res?.data?.error) {
          setGenerating(false);
        }
      }
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={`hover:cursor-pointer hover:bg-secondary hover:border:primary transition-all ease-in-out ${
        isDragActive ? "animate-pulse border-primary bg-secondary" : ""
      }`}
    >
      <CardContent className="flex flex-col items-center justify-center h-full px-2 py-24 text-xs">
        <input type="text" {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground text-2xl">
            {isDragActive
              ? "Drop the image here"
              : "Start by uploading an image"}
          </p>
          <p className="text-muted-froeground">
            Supported formats: .jpeg, .png, .webp, .jpg
          </p>
          {/* {imagePreview && <img src={imagePreview} alt="Preview" />} */}
        </div>
      </CardContent>
    </Card>
  );
}
