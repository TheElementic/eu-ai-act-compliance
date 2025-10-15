
import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AssessmentResult({ assessment }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const generateChecklistMutation = useMutation({
    mutationFn: async () => {
      const items = assessment.risk_tier === "High Risk" 
        ? getHighRiskItems(assessment.id)
        : getLimitedRiskItems(assessment.id);
      
      await base44.entities.ComplianceItem.bulkCreate(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-items'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const getHighRiskItems = (assessmentId) => [
    {
      assessment_id: assessmentId,
      title: "Establish Risk Management System",
      description: "Implement a continuous risk management system throughout the AI system's lifecycle, identifying and mitigating risks to health, safety, and fundamental rights.",
      article_reference: "Art. 9",
      category: "Risk Management",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Data Governance and Management",
      description: "Ensure training, validation, and testing datasets are relevant, representative, free of errors, and complete. Implement appropriate data governance practices.",
      article_reference: "Art. 10",
      category: "Data Governance",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Technical Documentation",
      description: "Draw up technical documentation demonstrating compliance with AI Act requirements. Include system design, development, testing information, and risk management procedures.",
      article_reference: "Art. 11",
      category: "Technical Documentation",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Automatic Recording of Events (Logging)",
      description: "Enable automatic recording of events (logs) throughout the AI system's lifetime to facilitate monitoring, identify incidents, and support post-market surveillance.",
      article_reference: "Art. 12",
      category: "Record Keeping",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Transparency and Information to Deployers",
      description: "Design the system to be sufficiently transparent to enable deployers to interpret and use system output appropriately. Provide clear, adequate instructions for use.",
      article_reference: "Art. 13",
      category: "Transparency",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Human Oversight Measures",
      description: "Implement measures for effective human oversight, including the ability to understand system capabilities, monitor operation in real-time, and intervene or interrupt the system when necessary.",
      article_reference: "Art. 14",
      category: "Human Oversight",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Accuracy, Robustness, and Cybersecurity",
      description: "Achieve appropriate levels of accuracy, robustness, and cybersecurity. Implement measures to protect against errors, faults, inconsistencies, and vulnerabilities throughout the system's lifecycle.",
      article_reference: "Art. 15",
      category: "Accuracy & Robustness",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Provider Obligations and Quality Management",
      description: "Establish and maintain a quality management system ensuring compliance with the AI Act. Document processes, techniques, procedures, and systematic actions for compliance verification.",
      article_reference: "Art. 17",
      category: "Technical Documentation",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Registration in EU Database",
      description: "Register your high-risk AI system in the EU database before placing it on the market or putting it into service. Provide required information for transparency.",
      article_reference: "Art. 71",
      category: "Transparency",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Post-Market Monitoring System",
      description: "Establish and document a post-market monitoring system proportionate to the nature of the AI. Actively collect, document, and analyze data on performance throughout the system's lifetime.",
      article_reference: "Art. 72",
      category: "Record Keeping",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Serious Incident Reporting",
      description: "Establish procedures to report serious incidents and malfunctioning to national authorities. Implement systems to identify and document incidents promptly.",
      article_reference: "Art. 73",
      category: "Record Keeping",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Conformity Assessment",
      description: "Undergo conformity assessment procedures to demonstrate compliance with EU AI Act requirements before placing the system on the market. Maintain conformity documentation.",
      article_reference: "Art. 43",
      category: "Technical Documentation",
      is_mandatory: true,
      weight: 3
    }
  ];

  const getLimitedRiskItems = (assessmentId) => [
    {
      assessment_id: assessmentId,
      title: "Transparency Obligations - AI Interaction Disclosure",
      description: "Inform users that they are interacting with an AI system unless this is obvious from the circumstances and context of use.",
      article_reference: "Art. 52(1)",
      category: "Transparency",
      is_mandatory: true,
      weight: 3
    },
    {
      assessment_id: assessmentId,
      title: "Basic Data Quality Standards",
      description: "Ensure data used for training and operation is relevant, representative, and of sufficient quality for the intended purpose.",
      article_reference: "Art. 10 (adapted)",
      category: "Data Governance",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Technical Documentation (Simplified)",
      description: "Maintain basic technical documentation describing the AI system's functionality, purpose, and limitations.",
      article_reference: "Art. 11 (adapted)",
      category: "Technical Documentation",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "User Instructions and Information",
      description: "Provide clear and accessible information to users about the AI system's capabilities, limitations, and appropriate use.",
      article_reference: "Art. 13 (adapted)",
      category: "Transparency",
      is_mandatory: true,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Basic Risk Assessment",
      description: "Conduct a basic assessment of potential risks associated with your AI system's use and document mitigation measures.",
      article_reference: "Art. 9 (adapted)",
      category: "Risk Management",
      is_mandatory: false,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Record Keeping and Logging",
      description: "Implement basic logging mechanisms to track system decisions and facilitate issue investigation if needed.",
      article_reference: "Art. 12 (adapted)",
      category: "Record Keeping",
      is_mandatory: false,
      weight: 1
    },
    {
      assessment_id: assessmentId,
      title: "Accuracy and Performance Monitoring",
      description: "Monitor AI system accuracy and performance regularly, implementing improvements as necessary.",
      article_reference: "Art. 15 (adapted)",
      category: "Accuracy & Robustness",
      is_mandatory: false,
      weight: 2
    },
    {
      assessment_id: assessmentId,
      title: "Cybersecurity Measures",
      description: "Implement appropriate cybersecurity measures to protect the AI system from unauthorized access and attacks.",
      article_reference: "Art. 15 (adapted)",
      category: "Cybersecurity",
      is_mandatory: false,
      weight: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-slate-200 shadow-2xl overflow-hidden">
            <div className={`h-2 ${assessment.risk_tier === "High Risk" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}`} />
            
            <CardHeader className="bg-white border-b border-slate-200 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <Badge 
                    className={`mb-4 ${
                      assessment.risk_tier === "High Risk" 
                        ? "bg-red-100 text-red-700 border-red-300" 
                        : "bg-green-100 text-green-700 border-green-300"
                    } border-2 px-4 py-1.5`}
                  >
                    {assessment.risk_tier === "High Risk" ? (
                      <AlertTriangle className="w-4 h-4 mr-2" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    {assessment.risk_tier}
                  </Badge>
                  <CardTitle className="text-3xl mb-2">Assessment Complete</CardTitle>
                  <CardDescription className="text-lg">
                    Your AI system has been classified based on EU AI Act criteria
                  </CardDescription>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">1</span>
                  Company Information
                </h3>
                <div className="bg-slate-50 rounded-lg p-6 space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Company Name</p>
                    <p className="font-semibold text-lg">{assessment.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">AI System Description</p>
                    <p className="text-slate-800">{assessment.company_description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">AI Function Type</p>
                    <p className="font-medium">{assessment.ai_function.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>
              </div>

              {/* Risk Classification */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">2</span>
                  Risk Classification
                </h3>
                <Card className={`border-2 ${
                  assessment.risk_tier === "High Risk" 
                    ? "border-red-300 bg-red-50" 
                    : "border-green-300 bg-green-50"
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {assessment.risk_tier === "High Risk" ? (
                        <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-lg mb-2">{assessment.risk_tier} AI System</h4>
                        {assessment.risk_tier === "High Risk" ? (
                          <p className="text-slate-700">
                            Your AI system involves decision-making about people and is classified as high-risk under the EU AI Act. 
                            This means stricter compliance requirements including conformity assessment, technical documentation, 
                            and ongoing monitoring obligations.
                          </p>
                        ) : (
                          <p className="text-slate-700">
                            Your AI system does not involve consequential decisions about individuals and is classified as limited risk. 
                            You have lighter compliance requirements focused on transparency and basic documentation.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">3</span>
                  Next Steps
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Generate your compliance checklist</p>
                      <p className="text-sm text-slate-600">
                        {assessment.risk_tier === "High Risk" 
                          ? "We'll create a comprehensive checklist with 12 mandatory requirements"
                          : "We'll create a focused checklist with key transparency and documentation requirements"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Track your compliance progress</p>
                      <p className="text-sm text-slate-600">
                        Mark items as complete, upload evidence, and monitor your readiness score
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Export your compliance report</p>
                      <p className="text-sm text-slate-600">
                        Generate a PDF report with your assessment, progress, and next steps
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => generateChecklistMutation.mutate()}
                disabled={generateChecklistMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg gap-2"
              >
                {generateChecklistMutation.isPending ? (
                  "Generating Checklist..."
                ) : (
                  <>
                    Generate My Compliance Checklist
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-900">
                  <strong>Reminder:</strong> This assessment and checklist are for guidance purposes only. 
                  Always consult qualified legal professionals for compliance decisions specific to your situation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
