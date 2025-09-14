import { z } from "zod";

export const filterSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "mandala", "all"]).default("all"),
  festiveModeOnly: z.enum(["yes", "no"]).default("no"),
});

export const generateSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "mandala"]),
  festiveMode: z.enum(["yes", "no"]).default("no"),
});

export const deleteSchema = z.object({
  id: z.string(),
});
