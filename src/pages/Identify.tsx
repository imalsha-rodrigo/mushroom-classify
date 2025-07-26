import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Leaf, Thermometer, Droplets, Sun, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserRole = "farmer" | "normal" | null;

interface PredictionResult {
  mushroomType: string;
  confidence: number;
  classId: number;
  features?: {
    colorMean: [number, number, number];
    textureFeatures: {
      contrast: number;
      correlation: number;
      energy: number;
      homogeneity: number;
      entropy: number;
    };
  };
  environmentalData?: {
    temperature: string;
    humidity: string;
    light: string;
    substrate: string;
  };
  nutritionalData?: {
    vitamins: string[];
    minerals: string[];
    benefits: string[];
  };
}

export default function Identify() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeMushroom = async () => {
    if (!uploadedImage || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please select your role and upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Call your ML backend API
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      
      const predictionResult: PredictionResult = {
        mushroomType: result.mushroomType,
        confidence: result.confidence,
        classId: result.classId,
        features: result.features,
        ...(selectedRole === "farmer" ? {
          environmentalData: getEnvironmentalData(result.classId)
        } : {
          nutritionalData: getNutritionalData(result.classId)
        })
      };
      
      setPrediction(predictionResult);
      
      toast({
        title: "Analysis Complete!",
        description: `Identified as ${predictionResult.mushroomType} with ${predictionResult.confidence}% confidence.`,
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEnvironmentalData = (classId: number) => {
    const envData: Record<number, any> = {
      1: { temperature: "18-22°C", humidity: "85-90%", light: "Indirect sunlight", substrate: "Hardwood sawdust" },
      2: { temperature: "20-25°C", humidity: "80-85%", light: "Low light", substrate: "Straw, cotton hulls" },
      3: { temperature: "15-20°C", humidity: "75-85%", light: "Shade", substrate: "Oak, beech logs" },
      4: { temperature: "22-28°C", humidity: "80-90%", light: "Filtered light", substrate: "Hardwood logs" },
      5: { temperature: "20-25°C", humidity: "75-85%", light: "Dark environment", substrate: "Composted manure" },
      6: { temperature: "Variable", humidity: "Variable", light: "Unknown", substrate: "Unknown" }
    };
    return envData[classId] || envData[6];
  };

  const getNutritionalData = (classId: number) => {
    const nutritionData: Record<number, any> = {
      1: {
        vitamins: ["Vitamin D", "Vitamin B3", "Folate"],
        minerals: ["Potassium", "Selenium", "Copper"],
        benefits: ["Supports immune system", "Rich in antioxidants", "Low calorie protein source"]
      },
      2: {
        vitamins: ["Vitamin B6", "Vitamin C", "Riboflavin"],
        minerals: ["Iron", "Zinc", "Phosphorus"],
        benefits: ["Anti-inflammatory properties", "Supports heart health", "Good source of fiber"]
      },
      4: {
        vitamins: ["Vitamin D", "Vitamin B2", "Niacin"],
        minerals: ["Iron", "Zinc", "Phosphorus"],
        benefits: ["Supports heart health", "Good source of protein", "Low in calories"]
      },
      5: {
        vitamins: ["Vitamin D", "Vitamin B12", "Niacin"],
        minerals: ["Selenium", "Potassium", "Copper"],
        benefits: ["Boosts immune function", "Supports bone health", "Low in calories"]
      }
    };
    return nutritionData[classId] || nutritionData[5];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mushroom Identification
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your mushroom and get tailored insights based on your role
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2 h-6 w-6 text-primary" />
              Upload & Analyze
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Your Role</label>
                <Select value={selectedRole || ""} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">🌾 Farmer - Get growing tips</SelectItem>
                    <SelectItem value="normal">🍄 Normal Person - Get nutrition info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Mushroom Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded mushroom" 
                        className="max-h-64 mx-auto rounded-lg shadow-soft"
                      />
                      <Button 
                        type="button" 
                        onClick={triggerFileInput}
                        variant="outline"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Leaf className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <Button 
                        type="button" 
                        onClick={triggerFileInput}
                        variant="outline"
                      >
                        Choose Image
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={analyzeMushroom}
                disabled={!uploadedImage || !selectedRole || isAnalyzing}
                className="w-full"
                variant="golden"
              >
                {isAnalyzing ? "Analyzing..." : "Identify Mushroom"}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            
            {prediction ? (
              <div className="space-y-6">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <h3 className="text-xl font-bold text-foreground">{prediction.mushroomType}</h3>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {prediction.confidence}% | Class ID: {prediction.classId}
                  </p>
                  {prediction.features && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>RGB: ({prediction.features.colorMean.map(v => v.toFixed(1)).join(', ')})</p>
                      <p>Texture Entropy: {prediction.features.textureFeatures.entropy.toFixed(3)}</p>
                    </div>
                  )}
                </div>

                {prediction.environmentalData && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center text-secondary">
                      <Leaf className="mr-2 h-5 w-5" />
                      Growing Recommendations
                    </h4>
                    <div className="grid gap-3">
                      <div className="flex items-center p-3 bg-card rounded-lg border">
                        <Thermometer className="mr-3 h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium">Temperature</p>
                          <p className="text-sm text-muted-foreground">{prediction.environmentalData.temperature}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-card rounded-lg border">
                        <Droplets className="mr-3 h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium">Humidity</p>
                          <p className="text-sm text-muted-foreground">{prediction.environmentalData.humidity}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-card rounded-lg border">
                        <Sun className="mr-3 h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium">Light Conditions</p>
                          <p className="text-sm text-muted-foreground">{prediction.environmentalData.light}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {prediction.nutritionalData && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center text-secondary">
                      <Heart className="mr-2 h-5 w-5" />
                      Nutritional Benefits
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Vitamins</p>
                        <div className="flex flex-wrap gap-2">
                          {prediction.nutritionalData.vitamins.map((vitamin, index) => (
                            <span key={index} className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
                              {vitamin}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Minerals</p>
                        <div className="flex flex-wrap gap-2">
                          {prediction.nutritionalData.minerals.map((mineral, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                              {mineral}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Health Benefits</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {prediction.nutritionalData.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Leaf className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p>Upload an image and select your role to get started</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}