import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/lib/const";
import { type FormValues, formSchema, type Image } from "@/types";

export default function CreatePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pattern: "kolam",
      festiveMode: false,
    },
  });
  const [images, setImages] = useState<string[]>([]);

  async function generateImage(values: FormValues): Promise<Image[]> {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return response.json();
  }

  const { mutate, isPending, isIdle, isError, error } = useMutation({
    mutationFn: generateImage,
    onSuccess: (response: Image[]) => {
      const images = response.map((image) => image.url);
      setImages(images);
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      setImages([]); // Clear any previous images on error
    },
  });

  async function handleSubmit(values: FormValues) {
    setImages([]); // Clear previous images
    mutate(values);
  }

  function downloadImage(imageUrl: string, index: number) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${form.getValues("pattern")}-${Date.now()}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function generateNewPattern() {
    setImages([]);
    // The form will be visible again since images array is empty
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {isIdle ? (
          // Main Card
          <Card className="bg-card border border-border rounded-lg p-8 shadow-glow">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary mr-3" />
                <h1 className="font-playfair text-3xl font-bold text-foreground">
                  Create Pattern
                </h1>
              </CardTitle>
              <CardDescription>
                Choose your pattern type and preferences
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  {/* Pattern Type Dropdown */}
                  <FormField
                    name="pattern"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pattern Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select pattern type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kolam">Kolam</SelectItem>
                            <SelectItem value="rangoli">Rangoli</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Festive Mode Checkbox */}
                  <FormField
                    name="festiveMode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Festive Mode
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Generate Button */}
                  <Button
                    type="submit"
                    size={"xl"}
                    variant={"default"}
                    className="w-full font-semibold text-lg"
                    disabled={isPending}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Pattern
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : isPending ? (
          <Card className="bg-card border border-border rounded-lg p-8 shadow-glow">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader className="h-10 w-10 animate-spin mb-4" />
              <p className="text-muted-foreground">
                Generating your {form.getValues("pattern")} pattern...
              </p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card className="bg-card border border-destructive rounded-lg p-8 shadow-glow">
            <CardContent className="text-center py-8">
              <div className="text-destructive-foreground bg-destructive/75 border border-destructive py-4 px-6 rounded-lg">
                <p className="font-semibold mb-2">Generation Failed</p>
                <p className="text-sm">
                  {error instanceof Error
                    ? error.message
                    : "Please try again later."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={generateNewPattern}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : images.length > 0 ? (
          <Card className="bg-card border border-border rounded-lg p-8 shadow-glow">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary mr-2" />
                Generated Patterns
              </CardTitle>
              <CardDescription>
                Your {form.getValues("pattern")} patterns are ready!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {images.map((image, index) => (
                  <div
                    key={`${form.getValues("pattern")}-${index}`}
                    className="relative group"
                  >
                    <img
                      src={image}
                      alt={`Generated ${form.getValues("pattern")} pattern ${index + 1}${form.getValues("festiveMode") ? " in festive style" : ""}`}
                      className="w-full aspect-square rounded-lg object-cover shadow-md"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-black hover:bg-white"
                        onClick={() => downloadImage(image, index)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  onClick={generateNewPattern}
                  variant="outline"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
