import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, Heart, Brain, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AssessmentData {
  id: string;
  timestamp: string;
  mood: string;
  stress: number;
  sleep: string;
  energy: number;
  social: string;
}

interface ProgressSectionProps {
  assessments: AssessmentData[];
}

const ProgressSection = ({ assessments }: ProgressSectionProps) => {
  const { user } = useAuth();

  // Generate trend data for multiple assessments
  const generateTrendData = () => {
    if (assessments.length <= 1) return [];
    
    return assessments
      .slice()
      .reverse() // Show chronologically
      .map((assessment, index) => ({
        time: new Date(assessment.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        mood: parseInt(assessment.mood) * 2, // Convert 1-5 to 2-10
        stress: assessment.stress,
        energy: assessment.energy,
        timestamp: assessment.timestamp
      }));
  };

  const trendData = generateTrendData();

  // Scenario 1: User not logged in
  if (!user) {
    return (
      <Card className="wellness-card">
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Track Your Progress Over Time</h2>
          <p className="text-muted-foreground mb-6">
            Create a free account to save your results and visualize your wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Scenario 2: User logged in but only one survey
  if (assessments.length <= 1) {
    return (
      <Card className="wellness-card">
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-accent-bright mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">You're Off to a Great Start!</h2>
          <p className="text-muted-foreground mb-6">
            Your first wellness report is saved. Complete another survey to see your progress and start your wellness journey!
          </p>
          <Link to="/assessment">
            <Button size="lg">
              Take Another Survey
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Scenario 3: User logged in with multiple surveys - show full graph
  return (
    <Card className="wellness-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Your Wellness Journey
        </CardTitle>
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
                r: 6 
              }}
              activeDot={{ 
                r: 8, 
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
                r: 6 
              }}
              activeDot={{ 
                r: 8, 
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
                r: 6 
              }}
              activeDot={{ 
                r: 8, 
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
  );
};

export default ProgressSection;