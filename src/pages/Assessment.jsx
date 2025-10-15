import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ChevronRight, Shield, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AssessmentResult from "../components/assessment/AssessmentResult";

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: "",
    company_description: "",
    ai_function: "",
    involves_people_decisions: null
  });

  useEffect(() => {
    const savedName = localStorage.getItem('eu_ai_act_company_name');
    if (savedName) {
      setFormData(prev => ({ ...prev, company_name: savedName }));
      setRememberMe(true);
    }
  }, []);

  const createAssessmentMutation = useMutation({
    mutationFn: async (data) => {
      const assessment = await base44.entities.Assessment.create(data);
      return assessment;
    },
    onSuccess: (assessment) => {
      if (rememberMe) {
        localStorage.setItem('eu_ai_act_company_name', formData.company_name);
      } else {
        localStorage.removeItem('eu_ai_act_company_name');
      }
      setResult(assessment);
    },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 1) return formData.company_name && formData.company_description;
    if (step === 2) return formData.ai_function;
    if (step === 3) return formData.involves_people_decisions !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    const riskTier = formData.involves_people_decisions ? "High Risk" : "Limited Risk";
    
    const assessmentData = {
      ...formData,
      risk_tier: riskTier,
      completed_date: new Date().toISOString().split('T')[0],
      status: "active"
    };

    createAssessmentMutation.mutate(assessmentData);
  };

  const aiFunctionOptions = [
    { value: "chatbot", label: "Chatbot / Conversational AI", description: "Customer support, virtual assistants" },
    { value: "analytics", label: "Analytics & Insights", description: "Data analysis, predictive models" },
    { value: "hr_automation", label: "HR Automation", description: "Recruitment, performance evaluation" },
    { value: "recommendation", label: "Recommendation Engine", description: "Content, product recommendations" },
    { value: "marketing", label: "Marketing Automation", description: "Targeting, personalization" },
    { value: "other", label: "Other AI Function", description: "Specify in description" }
  ];

  const progress = (step / 3) * 100;

  if (result) {
    return <AssessmentResult assessment={result} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Risk Tier Assessment</h1>
              <p className="text-slate-600">Answer a few questions to determine your compliance requirements</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Step {step} of 3</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-slate-200 shadow-xl">
              <CardHeader className="border-b border-slate-200 bg-white/50">
                <CardTitle className="text-2xl">
                  {step === 1 && "Company Information"}
                  {step === 2 && "AI Function Type"}
                  {step === 3 && "Decision-Making Assessment"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us about your company and AI system"}
                  {step === 2 && "What type of AI functionality does your SaaS provide?"}
                  {step === 3 && "Does your AI make decisions about people?"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-base font-semibold">
                        Company Name *
                      </Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange("company_name", e.target.value)}
                        placeholder="Enter your company name"
                        className="text-lg py-6"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company_description" className="text-base font-semibold">
                        AI System Description *
                      </Label>
                      <Textarea
                        id="company_description"
                        value={formData.company_description}
                        onChange={(e) => handleInputChange("company_description", e.target.value)}
                        placeholder="Briefly describe your AI system, its purpose, and how it's used in your SaaS product"
                        className="min-h-32 text-base"
                      />
                      <p className="text-sm text-slate-500">
                        This helps us understand your use case and provide relevant guidance
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Remember my company name for future assessments
                      </Label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <RadioGroup
                    value={formData.ai_function}
                    onValueChange={(value) => handleInputChange("ai_function", value)}
                    className="space-y-3"
                  >
                    {aiFunctionOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          formData.ai_function === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{option.label}</div>
                          <div className="text-sm text-slate-600 mt-1">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-900">
                        This question determines your risk tier. High-risk systems have more stringent requirements under the EU AI Act.
                      </AlertDescription>
                    </Alert>

                    <RadioGroup
                      value={formData.involves_people_decisions?.toString()}
                      onValueChange={(value) => handleInputChange("involves_people_decisions", value === "true")}
                      className="space-y-3"
                    >
                      <label
                        className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          formData.involves_people_decisions === true
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <RadioGroupItem value="true" className="mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-lg mb-2">
                            Yes, it involves decision-making about people
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p>Examples include:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Hiring or recruitment decisions</li>
                              <li>Credit scoring or loan approval</li>
                              <li>Biometric identification or verification</li>
                              <li>Employee performance evaluation</li>
                              <li>Access to services based on profiling</li>
                            </ul>
                          </div>
                          {formData.involves_people_decisions === true && (
                            <div className="mt-3 flex items-center gap-2 text-red-700 font-medium">
                              <AlertTriangle className="w-4 h-4" />
                              This will classify as High Risk
                            </div>
                          )}
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          formData.involves_people_decisions === false
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <RadioGroupItem value="false" className="mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-lg mb-2">
                            No, it does not make decisions about people
                          </div>
                          <div className="text-sm text-slate-600">
                            Your AI system provides insights, recommendations, or automation but does not 
                            make consequential decisions about individuals' rights, opportunities, or access to services.
                          </div>
                          {formData.involves_people_decisions === false && (
                            <div className="mt-3 flex items-center gap-2 text-green-700 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              This will classify as Limited Risk
                            </div>
                          )}
                        </div>
                      </label>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : navigate(createPageUrl("Home"))}
            className="px-6"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || createAssessmentMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 gap-2"
          >
            {createAssessmentMutation.isPending ? (
              "Processing..."
            ) : step === 3 ? (
              <>Complete Assessment <CheckCircle2 className="w-4 h-4" /></>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>

        <div className="mt-8">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900">
              <strong>Disclaimer:</strong> This assessment provides guidance only and does not constitute legal advice. 
              Consult with qualified legal counsel for definitive compliance decisions.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}