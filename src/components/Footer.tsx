import { Leaf, Github, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-100 to-slate-200 border-t border-slate-300 mt-16 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Mushroom Mentor</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 max-w-sm">
              Your intelligent guide to mushroom identification and cultivation. 
              Get detailed growing parameters for optimal mushroom cultivation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <a href="#mushroom-identification" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Identify Mushroom
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Growing Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Mushroom Types
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="mailto:contact@mushroommentor.com" 
                className="p-2 rounded-lg bg-slate-200 hover:bg-emerald-500 hover:text-white transition-colors dark:bg-slate-700 dark:hover:bg-emerald-600"
                title="Email us"
              >
                <Mail className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-200 hover:bg-emerald-500 hover:text-white transition-colors dark:bg-slate-700 dark:hover:bg-emerald-600"
                title="GitHub"
              >
                <Github className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-300 dark:border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2024 Mushroom Mentor. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500 dark:text-red-400" /> for mushroom enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}; 