import { env } from "cloudflare:workers";
import { atob } from "node:buffer";
import { randomInt } from "node:crypto";
import type { z } from "zod";
import type { generateSchema } from "./schema";

type Pattern = z.infer<typeof generateSchema>["pattern"];

function getPrompt(pattern: Pattern, festiveMode: boolean): string {
  if (pattern === "kolam") {
    if (festiveMode) {
      return "top view of a grand festive Kolam on a black floor, elaborate symmetrical geometric mandala with white rice flour and bright accent colors, decorated with flowers and small oil lamps, intricate dot grid design, traditional South Indian festival ambience, highly detailed digital illustration, glowing warm light";
    }
    return "top view of a traditional Kolam design on a black floor, intricate symmetrical geometric pattern drawn with white rice flour, dot grid structure, minimalist monochrome mandala, highly detailed digital illustration, soft natural lighting";
  } else if (pattern === "rangoli") {
    if (festiveMode) {
      return "top view of a vibrant festive rangoli on a black floor, large symmetrical mandala with complex floral motifs, peacock and lotus patterns, made with multicolored powders and fresh flower petals, decorated with glowing oil lamps (diyas) and candles, rich Diwali ambience, bright saturated colors, highly detailed digital artwork";
    }
    return "top view of a vibrant rangoli design on a black floor, symmetrical mandala layout with floral motifs and oil lamps (diyas), made with colorful powders and flower petals, festive Diwali ambience, richly saturated hues, detailed digital painting";
  } else {
    if (festiveMode) {
      return "top view of a grand colorful mandala on a black floor, elaborate symmetrical radial design with vibrant patterns, decorated with glowing lamps and floral accents, spiritual festive ambience, richly detailed digital artwork, glowing highlights";
    }
    return "top view of an intricate mandala design on a black floor, perfectly symmetrical radial patterns with fine linework, detailed sacred geometry, elegant monochrome style, highly detailed digital artwork, soft natural lighting";
  }
}

async function getDataURL(image?: string): Promise<string> {
  if (!image) {
    return "";
  }
  const binaryImage = atob(image);
  const img = Uint8Array.from(binaryImage, (c) => c.charCodeAt(0));
  const key = crypto.randomUUID();
  await env.R2.put(key, img, {
    httpMetadata: {
      contentType: "image/jpeg",
      contentEncoding: "base64",
      contentDisposition: "inline",
    },
  });
  return `https://pub-c85aef26888243298d5f48ab9e3a8d8b.r2.dev/${key}`;
}

export async function generateImage(
  pattern: Pattern,
  festiveMode: boolean,
  numImages: number = 2,
): Promise<string[]> {
  const prompt = getPrompt(pattern, festiveMode);
  const promises = [];

  for (let i = 0; i < numImages; i++) {
    promises.push(
      env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt: prompt,
        negative_prompt:
          "blurry, messy, distorted shapes, extra limbs, random objects, watermark, text, low quality",
        seed: randomInt(0, 1000),
      }),
    );
  }

  const responses = await Promise.all(promises);
  const dataUrlPromises = responses.map((response) =>
    getDataURL(response.image),
  );
  const uris = await Promise.all(dataUrlPromises);
  const filteredUris = uris.filter((uri) => uri !== "");
  return filteredUris;
}
