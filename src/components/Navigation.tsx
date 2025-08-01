import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 dark:bg-slate-900/50 dark:border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Mushroom Mentor</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};