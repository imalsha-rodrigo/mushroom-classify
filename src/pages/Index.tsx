import { Navigation } from "@/components/Navigation";
import { MushroomCard } from "@/components/MushroomCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Camera, Leaf, Users, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-mushrooms.jpg";
import shiitakeImage from "@/assets/shiitake.jpg";
import oysterImage from "@/assets/oyster.jpg";
import buttonImage from "@/assets/button.jpg";
import portobelloImage from "@/assets/portobello.jpg";

const mushroomTypes = [
  {
    name: "Shiitake",
    scientificName: "Lentinula edodes",
    image: shiitakeImage,
    description: "Popular medicinal mushroom known for immune-boosting properties and rich umami flavor."
  },
  {
    name: "Oyster Mushroom",
    scientificName: "Pleurotus ostreatus",
    image: oysterImage,
    description: "Versatile and easy-to-grow mushrooms with a delicate texture and mild flavor."
  },
  {
    name: "Button Mushroom",
    scientificName: "Agaricus bisporus",
    image: buttonImage,
    description: "The most common cultivated mushroom, perfect for beginners and everyday cooking."
  },
  {
    name: "Portobello",
    scientificName: "Agaricus bisporus (mature)",
    image: portobelloImage,
    description: "Mature button mushrooms with a meaty texture, perfect as a meat substitute."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Various mushrooms" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Mushroom Mentor
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your intelligent guide to mushroom identification and cultivation. 
              Get tailored recommendations whether you're a farmer or enthusiast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/identify">
                <Button size="lg" variant="golden" className="px-8 py-3">
                  <Camera className="mr-2 h-5 w-5" />
                  Identify Mushroom
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-3 bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Leaf className="mr-2 h-5 w-5" />
                Learn About Types
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tailored for Your Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized insights based on your role and interests
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-8 bg-card rounded-xl shadow-soft">
              <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Farmers</h3>
              <p className="text-muted-foreground">
                Get detailed environmental recommendations including temperature, humidity, 
                light conditions, and substrate requirements for optimal mushroom cultivation.
              </p>
            </div>
            
            <div className="text-center p-8 bg-card rounded-xl shadow-soft">
              <div className="w-16 h-16 bg-gradient-golden rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Enthusiasts</h3>
              <p className="text-muted-foreground">
                Discover nutritional benefits, vitamins, minerals, and health advantages 
                of different mushroom varieties for informed consumption choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mushroom Types Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Common Mushroom Varieties
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore different mushroom types and their unique characteristics
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mushroomTypes.map((mushroom, index) => (
              <MushroomCard
                key={index}
                name={mushroom.name}
                scientificName={mushroom.scientificName}
                image={mushroom.image}
                description={mushroom.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-earth">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Identify Your Mushroom?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Upload a photo and get instant identification with personalized recommendations
          </p>
          <Link to="/identify">
            <Button size="lg" variant="golden" className="px-8 py-3">
              <Camera className="mr-2 h-5 w-5" />
              Start Identification
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
