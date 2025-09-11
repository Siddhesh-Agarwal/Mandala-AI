import { z } from "zod";

export const filterSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "all"]).default("all"),
  festiveModeOnly: z.boolean().default(false),
});

export const generateSchema = z.object({
  pattern: z.enum(["kolam", "rangoli"]),
  festiveMode: z.boolean().default(false,
});

export const deleteSchema = z.object({
  id: z.uuid(),
});
