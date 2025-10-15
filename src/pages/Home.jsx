import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, ClipboardCheck, FileCheck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ClipboardCheck,
      title: "Risk Assessment",
      description: "Answer a few questions to determine your AI system's risk tier"
    },
    {
      icon: CheckCircle2,
      title: "Tailored Checklist",
      description: "Get article-specific requirements based on your risk tier"
    },
    {
      icon: FileCheck,
      title: "Evidence Tracking",
      description: "Document compliance efforts and upload supporting evidence"
    },
    {
      icon: Shield,
      title: "Readiness Score",
      description: "Monitor your compliance progress with weighted scoring"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              EU AI Act Compliance Made Simple
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Navigate EU AI Act
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Compliance with Confidence
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              The first guided compliance assistant for B2B SaaS companies. 
              Assess your risk tier, track requirements, and generate compliance reports.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate(createPageUrl("Assessment"))}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2 text-lg px-8 py-6"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(createPageUrl("Dashboard"))}
                className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-lg px-8 py-6"
              >
                View Dashboard
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>For guidance purposes only • Not legal advice</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 text-lg">Four simple steps to compliance readiness</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-2xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Complete your risk assessment in under 5 minutes and receive a customized compliance checklist with EU AI Act article references.
            </p>
            <Button
              size="lg"
              onClick={() => navigate(createPageUrl("Assessment"))}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 gap-2 text-lg px-8 py-6"
            >
              Begin Assessment Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer Footer */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-2">Important Legal Disclaimer</p>
              <p>
                This EU AI Act Compliance Assistant is provided for informational and guidance purposes only. 
                It does not constitute legal advice and should not be relied upon as a substitute for consultation 
                with qualified legal counsel. The interpretation and application of the EU AI Act may vary based on 
                specific circumstances. Always consult with legal professionals for compliance decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}