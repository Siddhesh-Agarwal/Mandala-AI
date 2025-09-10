import { Download, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Image } from "@/types";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

export function ImageCard({ image }: { image: Image }) {
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
      <CardHeader className="flex gap-4">
        <Badge variant="secondary" className="uppercase text-lg mx-2">
          {image.pattern}
        </Badge>
        {image.festiveMode && (
          <Badge variant="default" className="uppercase text-lg mx-2">
            Festive
          </Badge>
        )}
      </CardHeader>
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
            <Link to={image.url} target="_blank">
              <Button size="icon" variant="default">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={image.url} target="_blank" download={`${image.id}.jpeg`}>
              <Button size="icon" variant="secondary">
                <Download className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="icon" variant="destructive" onClick={deleteImage}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
