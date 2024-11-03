"use server";

import { checkImageProcessing } from "@/lib/CheckProcessing";
import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const genFillSchema = z.object({
  aspect: z.string(),
  activeImage: z.string(), // `activeImage` should be the public URL
  height: z.number(),
  width: z.number(),
});

export const genFill = actionClient
  .schema(genFillSchema)
  .action(async ({ parsedInput: { activeImage, aspect, height, width } }) => {
    try {
      const parts = activeImage.split("/upload/");
      const fillUrl = `${parts[0]}/upload/ar_${aspect},b_gen_fill,c_pad,w_${width},h_${height}/${parts[1]}`;

      console.log("Generated fillUrl:", fillUrl);

      let isProcessed = false;
      const maxAttempts = 20;
      const delay = 1000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = (await checkImageProcessing(fillUrl)) ?? false;
        if (isProcessed) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!isProcessed) {
        throw new Error("Image processing timed out");
      }

      return { success: fillUrl };
    } catch (error: any) {
      console.error("Error in bgReplace:", error);
      return { serverError: error.message || "Unknown server error" };
    }
  });
