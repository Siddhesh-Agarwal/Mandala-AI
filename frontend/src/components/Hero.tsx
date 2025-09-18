import { Download, Palette, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/60 to-accent/70" />

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-mandala rounded-full opacity-20 animate-pulse" />
        <div
          className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-mandala rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-mandala rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-accent mr-3" />
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-primary-foreground drop-shadow-lg">
            MandalaAI
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-foreground/90 font-inter mb-4 drop-shadow-md">
          Create Stunning Traditional Kolam & Rangoli Patterns
        </p>

        <p className="text-lg text-foreground/80 font-inter mb-8 max-w-2xl mx-auto leading-relaxed">
          Harness the power of AI to generate intricate geometric designs
          inspired by ancient Indian art forms. Preserve tradition while
          embracing innovation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={"/create"}>
            <Button
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/75 font-semibold text-xl shadow-glow"
            >
              <Palette className="h-6 w-6 mr-2" />
              Start Creating
            </Button>
          </Link>
          <Link to={"/gallery"}>
            <Button
              variant={"default"}
              size="xl"
              className="hover:bg-primary/75 text-lg"
            >
              <Download className="h-6 w-6 mr-2" />
              View Gallery
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            {
              title: "10+",
              description: "Patterns Created",
            },
            {
              title: "6",
              description: "Design Styles",
            },
            {
              title: "24/7",
              description: "AI Generation",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center bg-secondary/75 border-2 border-secondary rounded-md p-4"
            >
              <div className="text-3xl font-bold text-secondary-foreground">
                {item.title}
              </div>
              <div className="text-secondary-foreground/80 text-sm">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
