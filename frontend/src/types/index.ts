import { z } from "zod";

// Base form schema for creating patterns (used in Create.tsx)
export const formSchema = z.object({
  pattern: z.enum(["kolam", "rangoli"]),
  festiveMode: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;

// Extended form schema for gallery filtering (includes "all" option)
export const galleryFormSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "all"]),
  festiveModeOnly: z.boolean(),
});

export type GalleryFormValues = z.infer<typeof galleryFormSchema>;

// Image type for gallery display
export type Image = {
  id: string;
  url: string;
  metadata: FormValues;
};

// API Response types
export interface GenerateResponse {
  images?: string[];
  error?: string;
}
