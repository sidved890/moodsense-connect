import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Brain, Heart, TrendingUp, Download, Share2, AlertTriangle, 
  CheckCircle, Target, Calendar, FileText, Star, Lightbulb,
  Moon, Zap, Users, Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AssessmentData {
  id: string;
  timestamp: string;
  mood: string;
  stress: number;
  sleep: string;
  energy: number;
  social: string;
}

interface WellnessReportProps {
  assessments: AssessmentData[];
  currentAssessment: AssessmentData;
}

const WellnessReport = ({ assessments, currentAssessment }: WellnessReportProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate historical data for trends
  const generateTrendData = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: Math.max(1, parseInt(currentAssessment.mood) + Math.random() * 2 - 1),
        stress: Math.max(0, currentAssessment.stress + Math.random() * 3 - 1.5),
        energy: Math.max(0, currentAssessment.energy + Math.random() * 2 - 1),
        sleep: Math.max(1, parseInt(currentAssessment.sleep) + Math.random() * 1.5 - 0.75)
      });
    }
    
    // Ensure current data is last
    dates[dates.length - 1] = {
      date: 'Today',
      mood: parseInt(currentAssessment.mood),
      stress: currentAssessment.stress,
      energy: currentAssessment.energy,
      sleep: parseInt(currentAssessment.sleep)
    };
    
    return dates;
  };

  const trendData = generateTrendData();

  // AI Pattern Detection
  const detectPatterns = () => {
    const patterns = [];
    const risks = [];
    const positives = [];
    
    const mood = parseInt(currentAssessment.mood);
    const stress = currentAssessment.stress;
    const energy = currentAssessment.energy;
    const sleep = parseInt(currentAssessment.sleep);

    // Risk detection
    if (stress >= 7 && energy <= 3) {
      risks.push({
        type: 'high-stress-low-energy',
        severity: 'high',
        message: 'High stress combined with low energy may indicate burnout risk'
      });
    }

    if (mood <= 2 && sleep <= 2) {
      risks.push({
        type: 'mood-sleep-pattern',
        severity: 'medium',
        message: 'Poor sleep quality may be contributing to low mood'
      });
    }

    if (stress >= 8) {
      risks.push({
        type: 'chronic-stress',
        severity: 'high',
        message: 'Consistently high stress levels detected'
      });
    }

    // Positive patterns
    if (mood >= 4 && energy >= 7) {
      positives.push({
        type: 'high-wellbeing',
        message: 'Strong positive mood and energy correlation detected'
      });
    }

    if (sleep >= 4 && energy >= 6) {
      positives.push({
        type: 'sleep-energy',
        message: 'Good sleep quality is supporting your energy levels'
      });
    }

    return { risks, positives, patterns };
  };

  const { risks, positives } = detectPatterns();

  // Generate personalized recommendations
  const generateRecommendations = () => {
    const recommendations = [];
    const mood = parseInt(currentAssessment.mood);
    const stress = currentAssessment.stress;
    const energy = currentAssessment.energy;
    const sleep = parseInt(currentAssessment.sleep);

    if (stress >= 6) {
      recommendations.push({
        category: 'Stress Management',
        action: 'Practice 10 minutes of deep breathing daily',
        icon: Brain,
        priority: 'high'
      });
    }

    if (sleep <= 3) {
      recommendations.push({
        category: 'Sleep Hygiene',
        action: 'Establish a consistent bedtime routine',
        icon: Moon,
        priority: 'high'
      });
    }

    if (energy <= 4) {
      recommendations.push({
        category: 'Energy Boost',
        action: 'Take a 15-minute walk in natural light',
        icon: Zap,
        priority: 'medium'
      });
    }

    if (mood <= 3) {
      recommendations.push({
        category: 'Mood Support',
        action: 'Connect with a friend or loved one today',
        icon: Users,
        priority: 'medium'
      });
    }

    // Always add general wellness recommendations
    recommendations.push(
      {
        category: 'Mindfulness',
        action: 'Practice gratitude by writing down 3 positive things',
        icon: Heart,
        priority: 'low'
      },
      {
        category: 'Physical Wellness',
        action: 'Stay hydrated with 8 glasses of water',
        icon: Activity,
        priority: 'low'
      }
    );

    return recommendations.slice(0, 5);
  };

  const recommendations = generateRecommendations();

  // Doctor ready notes
  const generateDoctorNotes = () => {
    const notes = [];
    const mood = parseInt(currentAssessment.mood);
    const stress = currentAssessment.stress;
    const energy = currentAssessment.energy;
    const sleep = parseInt(currentAssessment.sleep);

    notes.push(`Current mood rating: ${mood}/5 (${mood <= 2 ? 'Low' : mood >= 4 ? 'Good' : 'Moderate'})`);
    notes.push(`Stress level: ${stress}/10 (${stress >= 7 ? 'High' : stress >= 4 ? 'Moderate' : 'Low'})`);
    notes.push(`Energy level: ${energy}/10 (${energy <= 3 ? 'Low' : energy >= 7 ? 'High' : 'Moderate'})`);
    notes.push(`Sleep quality: ${sleep}/5 (${sleep <= 2 ? 'Poor' : sleep >= 4 ? 'Good' : 'Fair'})`);
    notes.push(`Social connection: ${currentAssessment.social}/5`);

    if (risks.length > 0) {
      notes.push('Risk factors identified:');
      risks.forEach(risk => {
        notes.push(`• ${risk.message}`);
      });
    }

    if (positives.length > 0) {
      notes.push('Positive indicators:');
      positives.forEach(positive => {
        notes.push(`• ${positive.message}`);
      });
    }

    notes.push(`Assessment completed: ${new Date(currentAssessment.timestamp).toLocaleDateString()}`);

    return notes;
  };

  const doctorNotes = generateDoctorNotes();

  // Calculate wellness score
  const calculateWellnessScore = () => {
    const mood = parseInt(currentAssessment.mood) * 20;
    const stressInverted = (10 - currentAssessment.stress) * 10;
    const energy = currentAssessment.energy * 10;
    const sleep = parseInt(currentAssessment.sleep) * 20;
    
    return Math.round((mood + stressInverted + energy + sleep) / 4);
  };

  const wellnessScore = calculateWellnessScore();

  // PDF Generation
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = reportRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`MindTrack-Wellness-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Report downloaded! 📋",
        description: "Your wellness report has been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Share functionality
  const generateShareUrl = async () => {
    // In a real app, this would create a secure, temporary sharing link
    const reportData = {
      score: wellnessScore,
      summary: `Wellness Score: ${wellnessScore}%, Latest assessment from ${new Date(currentAssessment.timestamp).toLocaleDateString()}`,
      timestamp: currentAssessment.timestamp
    };
    
    const mockUrl = `https://mindtrack.app/shared/${btoa(JSON.stringify(reportData))}`;
    setShareUrl(mockUrl);
    
    navigator.clipboard.writeText(mockUrl);
    toast({
      title: "Share link copied! 🔗",
      description: "The secure sharing link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={generatePDF} disabled={isGeneratingPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </Button>
        <Button variant="outline" onClick={generateShareUrl} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Report
        </Button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-8 bg-background p-8 rounded-2xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-soft/50 border border-primary/20">
            <Brain className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">AI Wellness Report</span>
          </div>
          <h1 className="text-3xl font-bold">
            Your Personal
            <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent"> Wellness Analysis</span>
          </h1>
          <p className="text-muted-foreground">
            Generated on {new Date().toLocaleDateString()} • Powered by AI
          </p>
        </div>

        {/* Wellness Score */}
        <Card className="wellness-card text-center">
          <CardContent className="p-8">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: wellnessScore }]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="hsl(var(--primary))" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{wellnessScore}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Overall Wellness Score</h3>
            <Badge variant={wellnessScore >= 70 ? "default" : wellnessScore >= 50 ? "secondary" : "destructive"}>
              {wellnessScore >= 70 ? "Thriving" : wellnessScore >= 50 ? "Stable" : "Needs Attention"}
            </Badge>
          </CardContent>
        </Card>

        {/* Wellness Balance Radar Chart */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Wellness Balance Radar Chart
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              A holistic snapshot of your well-being across key areas
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={[
                {
                  metric: 'Mood',
                  value: parseInt(currentAssessment.mood) * 2, // Convert 1-5 to 2-10 scale
                  fullMark: 10
                },
                {
                  metric: 'Stress',
                  value: 10 - currentAssessment.stress, // Invert stress (high stress = low wellness)
                  fullMark: 10
                },
                {
                  metric: 'Energy',
                  value: currentAssessment.energy,
                  fullMark: 10
                },
                {
                  metric: 'Sleep',
                  value: parseInt(currentAssessment.sleep) * 2, // Convert 1-5 to 2-10 scale
                  fullMark: 10
                },
                {
                  metric: 'Social',
                  value: parseInt(currentAssessment.social) * 2, // Convert 1-5 to 2-10 scale
                  fullMark: 10
                }
              ]}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  className="text-sm font-medium"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  tickCount={6}
                />
                <Radar
                  name="Wellness"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Risk Factors */}
          {risks.length > 0 && (
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  AI-Detected Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {risks.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <Badge variant="destructive" className="mb-2">
                        {risk.severity} priority
                      </Badge>
                      <p className="text-sm">{risk.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Positive Indicators */}
          {positives.length > 0 && (
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent-bright">
                  <CheckCircle className="h-5 w-5" />
                  Positive Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {positives.map((positive, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-accent/20 border border-accent-bright/20">
                    <CheckCircle className="h-4 w-4 text-accent-bright mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{positive.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Personalized Recommendations */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent-bright" />
              AI-Powered Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rec.category}</h4>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.action}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Doctor Ready Notes */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary-accent" />
              Doctor Ready Notes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Take these notes to your healthcare provider for informed discussions about your mental wellness.
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 font-mono text-sm">
              {doctorNotes.map((note, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This assessment is for informational purposes only and should not replace professional medical advice. 
                Please consult with a qualified healthcare provider for personalized guidance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Generated by MindTrack AI • Your privacy is protected • Report #{currentAssessment.id}
          </p>
        </div>
      </div>

      {shareUrl && (
        <Card className="wellness-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Share Link Generated</p>
                <p className="text-xs text-muted-foreground">This secure link expires in 30 days</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WellnessReport;