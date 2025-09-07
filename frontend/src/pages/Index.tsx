import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen font-inter">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
