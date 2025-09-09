import { env } from "cloudflare:workers";
import type { z } from "zod";
import type { generateSchema } from "./schema";

type Pattern = z.infer<typeof generateSchema>["pattern"];

function getPrompt(pattern: Pattern, festiveMode: boolean): string {
  if (pattern === "kolam") {
    if (festiveMode) {
      return "top view of a grand festive Kolam on a black floor, elaborate symmetrical geometric mandala with white rice flour and bright accent colors, decorated with flowers and small oil lamps, intricate dot grid design, traditional South Indian festival ambience, highly detailed digital illustration, glowing warm light";
    }
    return "top view of a traditional Kolam design on a black floor, intricate symmetrical geometric pattern drawn with white rice flour, dot grid structure, minimalist monochrome mandala, highly detailed digital illustration, soft natural lighting";
  } else {
    if (festiveMode) {
      return "top view of a vibrant festive rangoli on a black floor, large symmetrical mandala with complex floral motifs, peacock and lotus patterns, made with multicolored powders and fresh flower petals, decorated with glowing oil lamps (diyas) and candles, rich Diwali ambience, bright saturated colors, highly detailed digital artwork";
    }
    return "top view of a vibrant rangoli design on a black floor, symmetrical mandala layout with floral motifs and oil lamps (diyas), made with colorful powders and flower petals, festive Diwali ambience, richly saturated hues, detailed digital painting";
  }
}

async function getDataURL(image?: string): Promise<string> {
  if (!image) {
    return "";
  }
  // return `data:image/jpeg;charset=utf-8;base64,${image}`;
  const key = crypto.randomUUID();
  await env.R2.put(key, image, {
    httpMetadata: {
      contentType: "image/jpeg",
      contentEncoding: "base64",
      contentDisposition: "inline",
    },
  });
  return key;
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
          "blurry, messy, distorted shapes, extra limbs, random objects, text, watermark, low quality",
        seed: 5,
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
