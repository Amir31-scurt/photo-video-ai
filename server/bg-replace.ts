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

const bgReplaceSchema = z.object({
  prompt: z.string(),
  activeImage: z.string(), // `activeImage` should be the public URL
});

export const bgReplace = actionClient
  .schema(bgReplaceSchema)
  .action(async ({ parsedInput: { prompt, activeImage } }) => {
    try {
      const parts = activeImage.split("/upload/");
      const bgReplaceUrl = prompt
        ? `${parts[0]}/upload/e_gen_background_replace:prompt_${prompt}/${parts[1]}`
        : `${parts[0]}/upload/e_gen_background_replace/${parts[1]}`;

      console.log("Generated bgReplaceUrl:", bgReplaceUrl);

      let isProcessed = false;
      const maxAttempts = 30;
      const delay = 3000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = (await checkImageProcessing(bgReplaceUrl)) ?? false;
        if (isProcessed) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!isProcessed) {
        throw new Error("Image processing timed out");
      }

      return { success: bgReplaceUrl };
    } catch (error: any) {
      console.error("Error in bgReplace:", error);
      return { serverError: error.message || "Unknown server error" };
    }
  });
