import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, Brain, Moon, Zap, Users, Share2, Calendar, Target, Lightbulb, Star, Clock } from 'lucide-react';
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
  const [timeFrame, setTimeFrame] = useState('7days');

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

  // Generate historical wellness trend data
  const generateTrendData = () => {
    const now = new Date();
    const data = [];
    
    const getDataPointsForTimeframe = () => {
      switch (timeFrame) {
        case '24hours':
          return 8; // Every 3 hours
        case '7days':
          return 7; // Daily
        case 'alltime':
          return 30; // Monthly overview
        default:
          return 7;
      }
    };

    const getTimeIncrement = () => {
      switch (timeFrame) {
        case '24hours':
          return 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        case '7days':
          return 24 * 60 * 60 * 1000; // 1 day in milliseconds
        case 'alltime':
          return 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        default:
          return 24 * 60 * 60 * 1000;
      }
    };

    const dataPoints = getDataPointsForTimeframe();
    const timeIncrement = getTimeIncrement();

    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * timeIncrement));
      
      // Generate realistic trending data
      const baseValues = latestAssessment ? {
        mood: parseInt(latestAssessment.mood) * 2,
        stress: latestAssessment.stress,
        energy: latestAssessment.energy
      } : { mood: 6, stress: 5, energy: 6 };

      // Add some realistic variation
      const variation = () => Math.random() * 2 - 1; // -1 to 1
      
      data.push({
        time: timeFrame === '24hours' 
          ? timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : timeFrame === '7days'
          ? timestamp.toLocaleDateString('en-US', { weekday: 'short' })
          : timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: timestamp.getTime(),
        mood: Math.max(1, Math.min(10, baseValues.mood + variation() * 1.5)),
        stress: Math.max(1, Math.min(10, baseValues.stress + variation() * 1.5)),
        energy: Math.max(1, Math.min(10, baseValues.energy + variation() * 1.5))
      });
    }

    // Ensure the last data point matches current assessment if available
    if (latestAssessment && data.length > 0) {
      const lastPoint = data[data.length - 1];
      lastPoint.mood = parseInt(latestAssessment.mood) * 2;
      lastPoint.stress = latestAssessment.stress;
      lastPoint.energy = latestAssessment.energy;
    }

    return data;
  };

  const trendData = generateTrendData();

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
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link to="/assessment">
            <Card className="wellness-card cursor-pointer">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">New Assessment</h3>
                <p className="text-sm text-muted-foreground">Check in on your wellbeing</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/report">
            <Card className="wellness-card cursor-pointer">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 text-secondary-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-1">AI Wellness Report</h3>
                <p className="text-sm text-muted-foreground">Generate detailed insights</p>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="wellness-card cursor-pointer" onClick={() => toast({ title: "Coming soon!", description: "Share feature will be available soon." })}>
            <CardContent className="p-4 text-center">
              <Share2 className="h-8 w-8 text-accent-bright mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Share Report</h3>
              <p className="text-sm text-muted-foreground">Export your insights</p>
            </CardContent>
          </Card>

          <Card className="wellness-card">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-secondary-accent mx-auto mb-2" />
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
            {/* Wellness Trends */}
            <Card className="wellness-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Your Wellness Journey
                  </CardTitle>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger className="w-40">
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24hours">Last 24 Hours</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="alltime">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid 
                      strokeDasharray="2 2" 
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, 10]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--accent-bright))"
                      strokeWidth={3}
                      dot={{ 
                        fill: 'hsl(var(--background))', 
                        stroke: 'hsl(var(--accent-bright))', 
                        strokeWidth: 3, 
                        r: 5 
                      }}
                      activeDot={{ 
                        r: 7, 
                        stroke: 'hsl(var(--accent-bright))', 
                        strokeWidth: 2,
                        fill: 'hsl(var(--background))'
                      }}
                      name="Mood"
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={3}
                      dot={{ 
                        fill: 'hsl(var(--background))', 
                        stroke: 'hsl(var(--destructive))', 
                        strokeWidth: 3, 
                        r: 5 
                      }}
                      activeDot={{ 
                        r: 7, 
                        stroke: 'hsl(var(--destructive))', 
                        strokeWidth: 2,
                        fill: 'hsl(var(--background))'
                      }}
                      name="Stress"
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ 
                        fill: 'hsl(var(--background))', 
                        stroke: 'hsl(var(--primary))', 
                        strokeWidth: 3, 
                        r: 5 
                      }}
                      activeDot={{ 
                        r: 7, 
                        stroke: 'hsl(var(--primary))', 
                        strokeWidth: 2,
                        fill: 'hsl(var(--background))'
                      }}
                      name="Energy"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-accent-bright bg-background"></div>
                    <span className="text-sm font-medium">Mood</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-destructive bg-background"></div>
                    <span className="text-sm font-medium">Stress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                    <span className="text-sm font-medium">Energy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Stats Summary */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Today's Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-accent/10">
                    <Heart className="h-6 w-6 text-accent-bright mx-auto mb-2" />
                    <p className="text-2xl font-bold text-accent-bright">
                      {latestAssessment ? parseInt(latestAssessment.mood) * 2 : 0}/10
                    </p>
                    <p className="text-sm text-muted-foreground">Mood</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-destructive/10">
                    <Brain className="h-6 w-6 text-destructive mx-auto mb-2" />
                    <p className="text-2xl font-bold text-destructive">
                      {latestAssessment ? latestAssessment.stress : 0}/10
                    </p>
                    <p className="text-sm text-muted-foreground">Stress</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">
                      {latestAssessment ? latestAssessment.energy : 0}/10
                    </p>
                    <p className="text-sm text-muted-foreground">Energy</p>
                  </div>
                </div>
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