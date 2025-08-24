import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSearchParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, Brain, Moon, Zap, Users, Share2, Calendar, Target, Lightbulb, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssessmentData {
  id: string;
  timestamp: string;
  mood: string;
  stress: number;
  sleep: string;
  energy: number;
  social: string;
}

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [currentQuote, setCurrentQuote] = useState('');

  const motivationalQuotes = [
    "Every day is a new opportunity to nurture your mental wellness.",
    "Small steps in self-care lead to big changes in wellbeing.",
    "Your mental health is just as important as your physical health.",
    "Progress, not perfection, is the goal of wellness.",
    "You have the strength to overcome today's challenges."
  ];

  useEffect(() => {
    // Load assessment data
    const savedData = localStorage.getItem('assessmentResponses');
    if (savedData) {
      const data = JSON.parse(savedData);
      setAssessments([data]);
    }

    // Set daily quote
    const today = new Date().getDate();
    setCurrentQuote(motivationalQuotes[today % motivationalQuotes.length]);

    // Show completion toast
    if (searchParams.get('completed') === 'true') {
      toast({
        title: "Assessment completed! 🎉",
        description: "Your responses have been saved and insights are ready.",
      });
    }
  }, [searchParams, toast]);

  const latestAssessment = assessments[0];

  const getWellnessInsights = (data: AssessmentData) => {
    const insights = [];
    
    if (parseInt(data.mood) <= 2) {
      insights.push({
        type: 'mood',
        severity: 'attention',
        message: 'Your mood seems low. Consider gentle activities like a short walk or listening to music.',
        icon: Heart
      });
    } else if (parseInt(data.mood) >= 4) {
      insights.push({
        type: 'mood',
        severity: 'positive',
        message: 'Great mood! This is a perfect time to tackle challenging tasks or connect with others.',
        icon: Heart
      });
    }

    if (data.stress >= 7) {
      insights.push({
        type: 'stress',
        severity: 'attention',
        message: 'High stress detected. Try deep breathing exercises or a 5-minute meditation.',
        icon: Brain
      });
    }

    if (parseInt(data.sleep) <= 2) {
      insights.push({
        type: 'sleep',
        severity: 'attention',
        message: 'Poor sleep quality. Consider a consistent bedtime routine and limiting screen time before bed.',
        icon: Moon
      });
    }

    if (data.energy <= 3) {
      insights.push({
        type: 'energy',
        severity: 'attention',
        message: 'Low energy levels. Ensure you\'re staying hydrated and consider light exercise.',
        icon: Zap
      });
    }

    return insights;
  };

  const getRecommendations = (data: AssessmentData) => {
    const recommendations = [
      "Take 3 deep breaths and notice how you feel",
      "Write down one thing you're grateful for today",
      "Step outside for 5 minutes and feel the fresh air",
      "Reach out to someone you care about",
      "Do a quick body scan and release any tension"
    ];

    return recommendations.slice(0, 3);
  };

  // Chart data
  const moodData = [
    { name: 'Today', mood: latestAssessment ? parseInt(latestAssessment.mood) : 0 },
  ];

  const wellnessData = [
    { name: 'Mood', value: latestAssessment ? parseInt(latestAssessment.mood) * 20 : 0, color: '#60A5FA' },
    { name: 'Energy', value: latestAssessment ? latestAssessment.energy * 10 : 0, color: '#34D399' },
    { name: 'Sleep', value: latestAssessment ? parseInt(latestAssessment.sleep) * 20 : 0, color: '#A78BFA' },
  ];

  const stressData = [
    { name: 'Stress Level', value: latestAssessment ? latestAssessment.stress * 10 : 0, fill: '#F87171' }
  ];

  if (!latestAssessment) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="wellness-card">
            <CardContent className="p-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
              <p className="text-muted-foreground mb-8">
                Take your first assessment to start tracking your mental wellness journey.
              </p>
              <Link to="/assessment">
                <Button size="lg" className="transition-bounce hover:scale-105">
                  Take Assessment
                </Button>
              </Link>
            </CardContent>
          </div>
        </div>
      </div>
    );
  }

  const insights = getWellnessInsights(latestAssessment);
  const recommendations = getRecommendations(latestAssessment);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Wellness
            <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent"> Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and discover personalized insights for better mental health.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/assessment">
            <Card className="wellness-card cursor-pointer">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">New Assessment</h3>
                <p className="text-sm text-muted-foreground">Check in on your wellbeing</p>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="wellness-card cursor-pointer" onClick={() => toast({ title: "Coming soon!", description: "Share feature will be available soon." })}>
            <CardContent className="p-4 text-center">
              <Share2 className="h-8 w-8 text-secondary-accent mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Share Report</h3>
              <p className="text-sm text-muted-foreground">Export your insights</p>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-accent-bright mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Last Check-in</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(latestAssessment.timestamp).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wellness Overview */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Wellness Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={wellnessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-secondary-accent" />
                  Stress Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">{latestAssessment.stress}/10</span>
                  <Badge variant={latestAssessment.stress >= 7 ? "destructive" : latestAssessment.stress >= 4 ? "secondary" : "default"}>
                    {latestAssessment.stress >= 7 ? "High" : latestAssessment.stress >= 4 ? "Moderate" : "Low"}
                  </Badge>
                </div>
                <Progress value={latestAssessment.stress * 10} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Insights & Recommendations */}
          <div className="space-y-8">
            {/* Daily Quote */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-accent-bright" />
                  Daily Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed italic text-muted-foreground">
                  "{currentQuote}"
                </p>
              </CardContent>
            </Card>

            {/* Insights */}
            {insights.length > 0 && (
              <Card className="wellness-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-accent-bright" />
                    Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                        <Icon className="h-5 w-5 text-primary mt-0.5" />
                        <p className="text-sm leading-relaxed">{insight.message}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary" />
                  Today's Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm leading-relaxed">{rec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;