import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Handshake, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PartnershipFormProps {
  onClose: () => void;
}

export default function PartnershipForm({ onClose }: PartnershipFormProps) {
  const [formData, setFormData] = useState({
    applicantType: "",
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    mission: "",
    vision: "",
    objectives: "",
    focusAreas: "",
    servicesOffered: "",
    servicesSought: "",
    partnershipReason: "",
    partnershipAreas: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const partnershipAreas = [
    "Permaculture and Regenerative Agriculture",
    "Mushroom Cultivation and Training",
    "Digital Education (E-learning / Remote training / ICT tools)",
    "Youth Empowerment and Skills Training",
    "Women's Empowerment",
    "Environmental Sustainability",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/partnership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Partnership Application Submitted!",
          description: "Thank you for your interest in partnering with RRF. We'll review your application and contact you soon.",
        });
        onClose();
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePartnershipAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      partnershipAreas: checked 
        ? [...prev.partnershipAreas, area]
        : prev.partnershipAreas.filter(a => a !== area)
    }));
  };

  const downloadForm = () => {
    // Create a link to download the PDF form
    const link = document.createElement('a');
    link.href = '/attached_assets/application form _1752357115281.pdf';
    link.download = 'RRF_Partnership_Application_Form.pdf';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-rrf-green to-rrf-dark-green text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Handshake className="w-6 h-6" />
              <CardTitle className="text-xl">Partnership Application</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadForm}
                className="text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            Partner with RRF in permaculture education and community development
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section A: Applicant Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-rrf-green">Section A: Applicant Details</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Are you applying as: *</label>
                <Select onValueChange={(value) => handleChange("applicantType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select applicant type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name of Individual or Organization *</label>
                  <Input
                    value={formData.organizationName}
                    onChange={(e) => handleChange("organizationName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person {formData.applicantType === 'organization' ? '*' : ''}</label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                    required={formData.applicantType === 'organization'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country and Location of Operations *</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section B: Organization Information */}
            {formData.applicantType === 'organization' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rrf-green">Section B: Organization Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Mission Statement</label>
                  <Textarea
                    value={formData.mission}
                    onChange={(e) => handleChange("mission", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Vision Statement</label>
                  <Textarea
                    value={formData.vision}
                    onChange={(e) => handleChange("vision", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Core Objectives</label>
                  <Textarea
                    value={formData.objectives}
                    onChange={(e) => handleChange("objectives", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Key Focus Areas / Projects</label>
                  <Textarea
                    value={formData.focusAreas}
                    onChange={(e) => handleChange("focusAreas", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">What services does your organization offer?</label>
                  <Textarea
                    value={formData.servicesOffered}
                    onChange={(e) => handleChange("servicesOffered", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">What services does your organization seek from RRF?</label>
                  <Textarea
                    value={formData.servicesSought}
                    onChange={(e) => handleChange("servicesSought", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Why do you want to partner with RRF?</label>
                  <Textarea
                    value={formData.partnershipReason}
                    onChange={(e) => handleChange("partnershipReason", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Section D: Partnership Areas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-rrf-green">Section D: Partnership Areas of Interest</h3>
              <div className="grid grid-cols-1 gap-3">
                {partnershipAreas.map((area) => (
                  <div key={area} className="flex items-start space-x-3">
                    <Checkbox
                      id={area}
                      checked={formData.partnershipAreas.includes(area)}
                      onCheckedChange={(checked) => handlePartnershipAreaChange(area, checked as boolean)}
                    />
                    <label htmlFor={area} className="text-sm cursor-pointer">
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-rrf-green hover:bg-rrf-dark-green"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Handshake className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}