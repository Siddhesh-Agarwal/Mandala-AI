import { z } from "zod";

// Base form schema for creating patterns (used in Create.tsx)
export const formSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "mandala"]),
  festiveMode: z.enum(["yes", "no"]),
});

export type FormValues = z.infer<typeof formSchema>;

// Extended form schema for gallery filtering (includes "all" option)
export const galleryFormSchema = z.object({
  pattern: z.enum(["kolam", "rangoli", "mandala", "all"]),
  festiveModeOnly: z.enum(["yes", "no"]),
});

export type GalleryFormValues = z.infer<typeof galleryFormSchema>;

// Image type for gallery display
export type Image = {
  id: string;
  url: string;
  pattern: "kolam" | "rangoli" | "mandala";
  festiveMode: boolean;
  createdAt: Date;
};
