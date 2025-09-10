import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ImageCard } from "@/components/ImageCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/lib/const";
import type { GalleryFormValues, Image } from "@/types";
import { galleryFormSchema } from "@/types";

async function fetchImages(values: GalleryFormValues): Promise<Image[]> {
  const params = new URLSearchParams({
    pattern: values.pattern,
    festiveModeOnly: values.festiveModeOnly.toString(),
  });
  const response = await fetch(`${BASE_URL}/api/images?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.status}`);
  }
  return response.json();
}

export default function GalleryPage() {
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    mode: "onChange",
    defaultValues: {
      pattern: "all",
      festiveModeOnly: false,
    },
  });
  const formValues = form.watch();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["images", formValues.pattern, formValues.festiveModeOnly],
    queryFn: () => fetchImages(formValues),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-playfair text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Pattern Gallery
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Explore our collection of AI-generated Kolam and Rangoli patterns
        </p>

        {/* Filters */}
        <Form {...form}>
          <form className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center mb-12">
            <FormField
              name="pattern"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-40" aria-label="Pattern type">
                        <SelectValue placeholder="Pattern type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Any Pattern</SelectItem>
                      <SelectItem value="kolam">Kolam</SelectItem>
                      <SelectItem value="rangoli">Rangoli</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="festiveModeOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Festive Mode Only
                  </FormLabel>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      {isPending ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin" size={40} />
          <span className="ml-2 text-muted-foreground">
            Loading patterns...
          </span>
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <div className="text-destructive-foreground bg-destructive/75 border border-destructive py-4 px-6 rounded-lg text-base max-w-md mx-auto">
            <p className="font-semibold mb-2">Failed to load images</p>
            <p className="text-sm">
              {error instanceof Error
                ? error.message
                : "Please try again later."}
            </p>
          </div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No patterns found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {data.map((image: Image) => (
            <ImageCard image={image} key={image.id} />
          ))}
        </div>
      )}
    </div>
  );
}
