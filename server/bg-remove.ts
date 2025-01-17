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

const bgRemoveSchema = z.object({
  format: z.string(),
  activeImage: z.string(),
});

export const bgRemoval = actionClient
  .schema(bgRemoveSchema)
  .action(async ({ parsedInput: { format, activeImage } }) => {
    const form = activeImage.split(format);
    const pngConvert = form[0] + "png";
    const parts = pngConvert.split("/upload/");
    const bgUrl = `${parts[0]}/upload/e_background_removal/${parts[1]}`;

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(bgUrl);
      if (isProcessed) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (!isProcessed) {
      throw new Error("Image processing timed out");
    }
    console.log(bgUrl);
    return { success: bgUrl };
  });
