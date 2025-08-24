import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Phone, MessageCircle, Heart } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  icon: React.ComponentType<any>;
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: "suicide-prevention",
    name: "National Suicide Prevention Lifeline",
    description: "Free, confidential support for people in distress, 24/7.",
    phone: "988",
    icon: Phone
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    description: "Free, 24/7 crisis support via text message.",
    phone: "Text HOME to 741741",
    icon: MessageCircle
  },
  {
    id: "samhsa",
    name: "SAMHSA National Helpline",
    description: "Treatment referral and information service for substance abuse and mental health, 24/7.",
    phone: "1-800-662-4357",
    icon: Heart
  },
  {
    id: "domestic-violence",
    name: "National Domestic Violence Hotline",
    description: "Confidential support for those experiencing domestic violence, 24/7.",
    phone: "1-800-799-7233",
    icon: Phone
  }
];

const EmergencyContacts = () => {
  const downloadAsPDF = async () => {
    const element = document.getElementById('emergency-contacts-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
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
      
      pdf.save('emergency-contacts.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Emergency & Helpline Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            If you are in immediate danger or crisis, please reach out to one of the resources below. 
            Help is available 24/7, and you don't have to go through this alone.
          </p>
          <Button onClick={downloadAsPDF} size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Download as PDF
          </Button>
        </div>

        <div id="emergency-contacts-content" className="bg-background p-8">
          <div className="mb-8 text-center print-block">
            <h1 className="text-3xl font-bold mb-4">Emergency & Helpline Resources</h1>
            <p className="text-muted-foreground">
              If you are in immediate danger or crisis, please reach out to one of the resources below.
            </p>
          </div>

          <div className="grid gap-6">
            {emergencyContacts.map((contact) => {
              const IconComponent = contact.icon;
              return (
                <Card key={contact.id} className="border border-border">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{contact.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {contact.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="font-mono text-lg font-semibold">
                          {contact.phone}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground print-block">
            <p>Generated from MindTrack • Keep this information accessible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;