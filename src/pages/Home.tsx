import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, BarChart3, Users, Sparkles, ArrowRight, Heart, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Track & Assess',
      description: 'Interactive self-assessments to understand your mood, stress levels, and sleep patterns.',
      color: 'wellness-calm'
    },
    {
      icon: TrendingUp,
      title: 'Visualize Progress',
      description: 'Beautiful charts and insights to track your mental wellness journey over time.',
      color: 'wellness-energy'
    },
    {
      icon: Users,
      title: 'Connect & Share',
      description: 'Generate reports to share with loved ones or healthcare providers when you choose.',
      color: 'wellness-focus'
    },
    {
      icon: Sparkles,
      title: 'Personalized Insights',
      description: 'Receive tailored wellness suggestions and motivational content based on your responses.',
      color: 'accent'
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background glow effect */}
        <div className="absolute inset-0 hero-glow"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-soft/50 border border-primary/20 mb-8">
              <Heart className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Mental wellness made simple</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary-accent to-accent-bright bg-clip-text text-transparent">
                Your journey to
              </span>
              <br />
              <span className="text-foreground">better mental health</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              MindTrack helps you understand your mental wellness through gentle self-assessment, 
              insightful tracking, and personalized recommendations for a healthier mind.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/assessment">
                <Button size="lg" className="group transition-bounce hover:scale-105 shadow-glow">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="transition-smooth hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for
              <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent"> mental wellness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple tools designed with care to support your mental health journey every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="wellness-card group">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-${feature.color}/20 mb-4 group-hover:scale-110 transition-bounce`}>
                      <Icon className={`h-6 w-6 text-${feature.color === 'accent' ? 'accent-bright' : feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 md:p-12 shadow-card">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
                <div className="text-muted-foreground">Find it helpful</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary-accent">5min</div>
                <div className="text-muted-foreground">Average assessment time</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-accent-bright">24/7</div>
                <div className="text-muted-foreground">Always available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-secondary-accent/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your mental health matters
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the first step towards better mental wellness. Your data is private, 
              your journey is personal, and your wellbeing is our priority.
            </p>
            <Link to="/assessment">
              <Button size="lg" className="transition-bounce hover:scale-105 shadow-glow">
                <Brain className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;