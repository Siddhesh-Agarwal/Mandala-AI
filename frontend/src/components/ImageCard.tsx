import { Download, Eye, Trash2 } from "lucide-react";
import type { Image } from "@/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ImageCard({ image }: { image: Image }) {
  function downloadImage() {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = `${image.pattern}-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function viewImage() {
    window.open(image.url, "_blank");
  }

  function deleteImage() {
    fetch(`/api/images/${image.id}`, {
      method: "DELETE",
    });
    window.location.reload();
  }

  return (
    <Card
      key={image.id}
      className="group overflow-hidden hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
    >
      <div className="relative overflow-hidden">
        <img
          src={image.url}
          alt={`AI-Generated ${image.pattern} pattern${image.festiveMode ? " in festive style" : ""}`}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2">
            <Button size="icon" variant="default" onClick={viewImage}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={downloadImage}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive" onClick={deleteImage}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
