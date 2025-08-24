import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Heart, BarChart3, User, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Heart },
    { name: 'Assessment', href: '/assessment', icon: BarChart3 },
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'About', href: '/about', icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-xl gradient-hero transition-smooth group-hover:scale-110">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent">
                MindTrack
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button 
                      variant={isActive(item.href) ? "default" : "ghost"}
                      size="sm"
                      className="transition-smooth hover:scale-105"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button would go here */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">MindTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Supporting mental wellness through thoughtful tracking and insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;