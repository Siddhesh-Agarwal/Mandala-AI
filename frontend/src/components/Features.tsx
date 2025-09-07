import { Brain, Download, Globe, Heart, Palette, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Generation',
    description: 'Advanced machine learning algorithms create authentic Kolam and Rangoli patterns with mathematical precision and artistic beauty.'
  },
  {
    icon: Palette,
    title: 'Customizable Colors',
    description: 'Choose from traditional color palettes or create your own. Generate patterns in any color scheme to match your vision.'
  },
  {
    icon: Download,
    title: 'High-Resolution Export',
    description: 'Download your creations in multiple formats and resolutions, perfect for printing, digital display, or sharing.'
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Create stunning patterns in seconds. No artistic skills required - just describe your vision and watch it come to life.'
  },
  {
    icon: Globe,
    title: 'Cultural Authenticity',
    description: 'Our AI is trained on thousands of traditional patterns, ensuring cultural accuracy and respect for ancient art forms.'
  },
  {
    icon: Heart,
    title: 'Preserve Tradition',
    description: 'Help keep traditional art forms alive by creating modern interpretations of classical Kolam and Rangoli designs.'
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose MandalaAI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Experience the perfect blend of ancient wisdom and modern technology. 
            Create beautiful, meaningful patterns that honor tradition while embracing innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mr-4 shadow-mandala">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};