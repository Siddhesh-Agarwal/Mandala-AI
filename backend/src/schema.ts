import { z } from "zod";

export const filterSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "all"]),
  festiveMode: z.boolean(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export const generateSchema = z.object({
  pattern: z.enum(["kolam", "rangoli"]),
  festiveMode: z.boolean(),
});
