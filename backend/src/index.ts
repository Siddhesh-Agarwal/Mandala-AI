import { env } from "cloudflare:workers";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { imageTable } from "./db/schema";
import { deleteSchema, filterSchema, generateSchema } from "./schema";
import { generateImage } from "./utils";

const app = new Hono().basePath("/api");
const db = drizzle(env.DB);

app.use(
  "*",
  cors({
    origin: ["https://mandala-ai.pages.dev"],
    allowMethods: ["*"],
    allowHeaders: ["*"],
    credentials: true,
  }),
);

app.get("/images", zValidator("param", filterSchema), async (c) => {
  const { pattern, festiveModeOnly } = c.req.valid("param");
  const conditions = [];
  if (pattern !== "all") {
    conditions.push(eq(imageTable.pattern, pattern));
  }
  if (festiveModeOnly === "yes") {
    conditions.push(eq(imageTable.festiveMode, true));
  }
  const images = await db
    .select()
    .from(imageTable)
    .where(and(...conditions))
    .orderBy(desc(imageTable.createdAt));
  return c.json(images);
});

app.post("/generate", zValidator("form", generateSchema), async (c) => {
  const { pattern, festiveMode } = c.req.valid("form");
  const festiveModeBool = festiveMode === "yes";
  const images = await generateImage(pattern, festiveModeBool);
  const data = await Promise.all(
    images.map(async (image) => {
      const res = await db
        .insert(imageTable)
        .values({ pattern, festiveMode: festiveModeBool, url: image })
        .returning();
      if (res.length === 1) {
        return res[0];
      }
    }),
  );
  const filteredData = data.filter((val) => val !== undefined);
  return c.json(filteredData);
});

app.delete("/images/:id", zValidator("param", deleteSchema), async (c) => {
  const { id } = c.req.valid("param");
  const result = await db
    .delete(imageTable)
    .where(eq(imageTable.id, id))
    .limit(1)
    .returning();
  if (result.length !== 1) {
    return c.status(404);
  }
  const deletedImage = result[0].url;
  const parts = deletedImage.split("/").filter((part) => part !== "");
  const key = parts[parts.length - 1];
  env.R2.delete(key);
  return c.json(result);
});

app.get("/stats", async (c) => {
  const result = await db.select({ total: sum(imageTable) }).from(imageTable);
  return c.json(result);
});

export default app;
