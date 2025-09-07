import { env } from "cloudflare:workers";
import type { z } from "zod";
import type { generateSchema } from "./schema";

type Pattern = z.infer<typeof generateSchema>["pattern"];

function getPrompt(pattern: Pattern, festiveMode: boolean): string {
  if (pattern === "kolam") {
    if (festiveMode) {
      return "";
    }
    return "";
  } else {
    if (festiveMode) {
      return "";
    }
    return "";
  }
}

function getDataURI(image?: string) {
  if (!image) {
    return "";
  }
  return `data:image/jpeg;charset=utf-8;base64,${image}`;
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
        seed: Math.floor(Math.random() * 10000),
      }),
    );
  }

  const responses = await Promise.all(promises);
  return responses.map((response) => getDataURI(response.image));
}
