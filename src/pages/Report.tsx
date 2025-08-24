import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft } from 'lucide-react';
import WellnessReport from '@/components/WellnessReport';

interface AssessmentData {
  id: string;
  timestamp: string;
  mood: string;
  stress: number;
  sleep: string;
  energy: number;
  social: string;
}

const Report = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);

  useEffect(() => {
    // Load assessment data
    const savedData = localStorage.getItem('assessmentResponses');
    if (savedData) {
      const data = JSON.parse(savedData);
      setAssessments([data]);
      setCurrentAssessment(data);
    }
  }, []);

  if (!currentAssessment) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="wellness-card">
            <CardContent className="p-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">No Assessment Data Found</h2>
              <p className="text-muted-foreground mb-8">
                Please complete an assessment first to generate your AI Wellness Report.
              </p>
              <Button onClick={() => navigate('/assessment')} size="lg">
                Take Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Wellness
            <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent"> Report</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive analysis of your mental wellness with AI-powered insights and personalized recommendations.
          </p>
        </div>

        {/* Report Component */}
        <WellnessReport 
          assessments={assessments}
          currentAssessment={currentAssessment}
        />
      </div>
    </div>
  );
};

export default Report;