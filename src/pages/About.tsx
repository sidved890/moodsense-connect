import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Target, Brain, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We approach mental health with empathy, understanding that everyone\'s journey is unique and deserves respect.',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your mental health data is deeply personal. We prioritize privacy and security in everything we build.',
      color: 'text-secondary-accent'
    },
    {
      icon: Users,
      title: 'Connection Matters',
      description: 'Mental wellness thrives in community. We help you share insights with trusted people in your life.',
      color: 'text-accent-bright'
    },
    {
      icon: Lightbulb,
      title: 'Evidence-Based',
      description: 'Our recommendations are grounded in research and proven mental health practices.',
      color: 'text-wellness-focus'
    }
  ];

  const features = [
    'Self-assessment tools for mood, stress, and sleep tracking',
    'Beautiful data visualization to understand your patterns',
    'Personalized wellness recommendations and insights',
    'Shareable reports for healthcare providers and loved ones',
    'Daily motivation and evidence-based wellness tips',
    'Complete privacy and data security'
  ];

  const stats = [
    { number: '1 in 5', label: 'Adults experience mental health issues annually' },
    { number: '50%', label: 'Of mental health conditions begin by age 14' },
    { number: '75%', label: 'Of people don\'t receive the care they need' }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-soft/50 border border-primary/20 mb-6">
            <Brain className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Our Mission</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Mental health support through
            <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent"> thoughtful technology</span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            MindTrack was created to bridge the gap between self-awareness and professional mental health care. 
            We believe that understanding your mental wellness patterns is the first step toward better health.
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">The Challenge We're Addressing</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="wellness-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="wellness-card">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Target className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-3">Why Early Detection Matters</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mental health challenges often develop gradually, making them hard to recognize until they significantly 
                    impact daily life. By tracking mood, stress, and sleep patterns, individuals can identify concerning 
                    trends early and take proactive steps toward wellness. MindTrack provides the tools to make this 
                    self-awareness accessible to everyone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Believe</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="wellness-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl bg-muted/20">
                        <Icon className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{value.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Helps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How MindTrack Supports Your Journey</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comprehensive Mental Wellness Tracking</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent-bright mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="wellness-card">
              <CardContent className="p-8">
                <h4 className="text-lg font-semibold mb-4">The MindTrack Difference</h4>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Unlike basic mood trackers, MindTrack provides comprehensive insights that help you understand 
                  the connections between different aspects of your mental wellness.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our personalized recommendations are designed to be actionable and achievable, helping you 
                  build sustainable wellness habits one step at a time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-16">
          <Card className="wellness-card">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-3">Your Privacy is Our Priority</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We understand that mental health data is deeply personal. MindTrack uses a secure, encrypted database to store your wellness data, ensuring it remains strictly confidential. You have complete control over your information, and we will never share, sell, distribute, or access your personal wellness data.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Secure Storage</Badge>
                    <Badge variant="secondary">No Data Mining</Badge>
                    <Badge variant="secondary">User Controlled</Badge>
                    <Badge variant="secondary">Transparent</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="wellness-card">
            <CardContent className="p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to start your wellness journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Take the first step toward better mental health awareness. 
                Your journey to wellness begins with understanding where you are today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/assessment">
                  <Button size="lg" className="transition-bounce hover:scale-105">
                    Take Your First Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="transition-smooth">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;