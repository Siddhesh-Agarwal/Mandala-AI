import { env } from "cloudflare:workers";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cache } from "hono/cache";
import z from "zod";
import { imageTable } from "./db/schema";
import { generateImage } from "./utils";
import { filterSchema, generateSchema } from "./schema";

const app = new Hono().basePath("/api");
const db = drizzle(env.MY_DB);

app.get("/health", (c) => {
  return c.text("OK");
});

app.get(
  "/images",
  zValidator("param", filterSchema),
  cache({
    cacheName: "generate-images",
    cacheControl: "max-age=3600",
  }),
  async (c) => {
    const { pattern, festiveMode, limit, offset } = c.req.valid("param");
    const conditions = [];
    if (pattern !== "all") {
      conditions.push(eq(imageTable.pattern, pattern));
    }
    if (festiveMode) {
      conditions.push(eq(imageTable.festiveMode, true));
    }
    const images = await db
      .select()
      .from(imageTable)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);
    return c.json(images);
  },
);

app.post(
  "/generate",
  zValidator("form", generateSchema),
  cache({
    cacheName: "generate-images",
    cacheControl: "max-age=3600",
    keyGenerator: (c) =>
      c.req.formData().then((data) => [...data.values()].join("-")),
  }),
  async (c) => {
    const { pattern, festiveMode } = c.req.valid("form");
    const images = await generateImage(pattern, festiveMode);
    const data = await Promise.all(
      images.map(async (image) => {
        const res = await db
          .insert(imageTable)
          .values({ pattern, festiveMode, url: image })
          .returning();
        if (res.length === 1) {
          return res[0];
        }
      }),
    );
    const filteredData = data.filter((val) => val !== undefined);
    return c.json(filteredData);
  },
);

export default app;
