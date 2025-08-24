import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, ArrowLeft, ArrowRight, Brain } from 'lucide-react';

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const questions = [
    {
      id: 'mood',
      title: 'How would you rate your overall mood today?',
      type: 'radio',
      options: [
        { value: '1', label: 'Very Low - Feeling quite down or sad' },
        { value: '2', label: 'Low - Somewhat down or blue' },
        { value: '3', label: 'Neutral - Feeling okay, neither good nor bad' },
        { value: '4', label: 'Good - Feeling positive and upbeat' },
        { value: '5', label: 'Very Good - Feeling excellent and joyful' }
      ]
    },
    {
      id: 'stress',
      title: 'How stressed have you felt over the past week?',
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      labels: ['Not stressed at all', 'Extremely stressed']
    },
    {
      id: 'sleep',
      title: 'How would you rate your sleep quality recently?',
      type: 'radio',
      options: [
        { value: '1', label: 'Very Poor - Barely slept or very restless' },
        { value: '2', label: 'Poor - Some sleep but not restful' },
        { value: '3', label: 'Fair - Decent sleep with some disturbances' },
        { value: '4', label: 'Good - Mostly good, restful sleep' },
        { value: '5', label: 'Excellent - Deep, refreshing sleep' }
      ]
    },
    {
      id: 'energy',
      title: 'How has your energy level been this week?',
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      labels: ['No energy at all', 'Full of energy']
    },
    {
      id: 'social',
      title: 'How connected do you feel to others?',
      type: 'radio',
      options: [
        { value: '1', label: 'Very Isolated - Feeling very alone and disconnected' },
        { value: '2', label: 'Somewhat Isolated - Limited meaningful connections' },
        { value: '3', label: 'Neutral - Some connections but could be stronger' },
        { value: '4', label: 'Connected - Good relationships and support' },
        { value: '5', label: 'Very Connected - Strong, meaningful relationships' }
      ]
    }
  ];

  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = responses[questions[currentStep]?.id] !== undefined;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      if (!user) {
        // If not logged in, redirect to login
        toast({
          title: "Please sign in",
          description: "You need to be logged in to save your assessment.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      setSaving(true);
      try {
        // Save to Supabase
        const { error } = await supabase
          .from('wellness_assessments')
          .insert({
            user_id: user.id,
            mood: parseInt(responses.mood),
            stress: responses.stress,
            sleep: parseInt(responses.sleep),
            energy: responses.energy,
            social: parseInt(responses.social)
          });

        if (error) {
          toast({
            title: "Error saving assessment",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Also save to localStorage as backup
          localStorage.setItem('assessmentResponses', JSON.stringify({
            ...responses,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
          }));
          
          toast({
            title: "Assessment completed! 🎉",
            description: "Your responses have been saved successfully."
          });
          navigate('/dashboard?completed=true');
        }
      } catch (error) {
        toast({
          title: "Error saving assessment",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-soft/50 border border-primary/20 mb-4">
            <Brain className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Mental Wellness Assessment</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Let's check in on your
            <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent"> wellbeing</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            This quick assessment helps us understand how you're feeling and provide personalized insights.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="wellness-card mb-8">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{currentQuestion.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestion.type === 'radio' && (
              <RadioGroup
                value={responses[currentQuestion.id] || ''}
                onValueChange={(value) => handleResponse(currentQuestion.id, value)}
                className="space-y-4"
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-smooth">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <Label htmlFor={option.value} className="flex-1 text-sm leading-relaxed cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'slider' && (
              <div className="space-y-6">
                <div className="px-4">
                  <Slider
                    value={[responses[currentQuestion.id] || currentQuestion.min]}
                    onValueChange={(value) => handleResponse(currentQuestion.id, value[0])}
                    max={currentQuestion.max}
                    min={currentQuestion.min}
                    step={currentQuestion.step}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground px-4">
                  <span>{currentQuestion.labels?.[0]}</span>
                  <span className="font-medium text-primary">
                    {responses[currentQuestion.id] !== undefined ? responses[currentQuestion.id] : currentQuestion.min}/{currentQuestion.max}
                  </span>
                  <span>{currentQuestion.labels?.[1]}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="transition-smooth"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed || saving}
            className="transition-bounce hover:scale-105"
          >
            {isLastStep ? (
              <>
                {saving ? "Saving..." : "Complete Assessment"}
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Help text */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Your responses are completely private and help us provide better insights for your wellbeing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assessment;