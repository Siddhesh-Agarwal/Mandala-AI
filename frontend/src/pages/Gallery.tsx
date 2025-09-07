import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Download, Eye, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const response = await fetch(
    `${BASE_URL}/api/images?pattern=${values.pattern}&festiveMode=${values.festiveMode}`,
  );
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
      festiveMode: false,
    },
  });
  const formValues = form.watch();
  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "images",
      formValues.pattern,
      formValues.festiveMode,
      new Date(),
    ],
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
              name="festiveMode"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((image: Image) => (
            <Card
              key={image.id}
              className="group overflow-hidden hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={`AI-Generated ${image.metadata.pattern} pattern${image.metadata.festiveMode ? " in festive style" : ""}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                      onClick={() => window.open(image.url, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = image.url;
                        link.download = `${image.metadata.pattern}-${image.id}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
