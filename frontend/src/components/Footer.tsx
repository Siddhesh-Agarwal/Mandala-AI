import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-primary-glow mr-3" />
              <h3 className="font-playfair text-2xl font-bold">MandalaAI</h3>
            </div>
            <p className="text-background/80 font-inter leading-relaxed mb-6 max-w-md">
              Preserving ancient Indian art traditions through modern AI
              technology. Create beautiful Kolam and Rangoli patterns that honor
              cultural heritage while embracing innovation.
            </p>
          </div>

          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">
              Features
            </h4>
            <ul className="space-y-3 font-inter">
              <li>
                <Link
                  to="/create"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Generate
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background/60 font-inter text-sm mb-4 md:mb-0">
              © 2025 Centille. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
