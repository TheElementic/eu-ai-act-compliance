import React from "react";
import { api as base44 } from "../api/appApi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ClipboardList,
  FileText,
  Plus,
  AlertTriangle // Added AlertTriangle import
} from "lucide-react";
import { motion } from "framer-motion";

import ReadinessScoreCard from "../components/dashboard/ReadinessScoreCard";
import CategoryProgress from "../components/dashboard/CategoryProgress";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [showForgetDialog, setShowForgetDialog] = React.useState(false); // Added state for dialog

  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => base44.entities.Assessment.filter({ status: 'active' }, '-created_date', 1),
  });

  const activeAssessment = assessments[0];

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['compliance-items', activeAssessment?.id],
    queryFn: () => activeAssessment 
      ? base44.entities.ComplianceItem.filter({ assessment_id: activeAssessment.id })
      : [],
    enabled: !!activeAssessment,
  });

  const handleForget = () => {
    localStorage.removeItem('eu_ai_act_company_name');
    setShowForgetDialog(false);
    // Optionally, you might want to refetch or invalidate queries related to assessments
    // to reflect that a potential saved company name is gone, though for this specific
    // scenario, it mostly affects the "No Active Assessment" flow or future assessments.
    // queryClient.invalidateQueries(['assessments']); 
  };

  const savedCompanyName = localStorage.getItem('eu_ai_act_company_name'); // Get saved company name from localStorage

  const calculateStats = () => {
    if (!items.length) return { total: 0, completed: 0, inProgress: 0, notStarted: 0, readiness: 0 };

    const completed = items.filter(i => i.status === "Completed").length;
    const inProgress = items.filter(i => i.status === "In Progress").length;
    const notStarted = items.filter(i => i.status === "Not Started").length;

    const mandatoryItems = items.filter(i => i.is_mandatory);
    const completedMandatory = mandatoryItems.filter(i => i.status === "Completed");
    const totalWeight = items.reduce((sum, i) => sum + (i.weight || 1), 0);
    const completedWeight = items
      .filter(i => i.status === "Completed")
      .reduce((sum, i) => sum + (i.weight || 1), 0);

    const readiness = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

    return {
      total: items.length,
      completed,
      inProgress,
      notStarted,
      readiness,
      mandatoryCompleted: completedMandatory.length,
      mandatoryTotal: mandatoryItems.length
    };
  };

  const formatAIFunction = (aiFunction) => {
    const formatted = aiFunction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return formatted.replace('Hr ', 'HR ');
  };

  const stats = calculateStats();

  if (assessmentsLoading || !activeAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-4">No Active Assessment</h2>
          <p className="text-slate-600 mb-6">
            Start by completing a risk assessment to generate your compliance checklist
          </p>
          <Link to={createPageUrl("Assessment")}>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compliance Dashboard</h1>
            <p className="text-slate-600 mt-1">
              {activeAssessment.company_name} • {activeAssessment.risk_tier}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {savedCompanyName && (
              <Button
                variant="outline"
                onClick={() => setShowForgetDialog(true)}
                className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4" />
                Forget Company Name
              </Button>
            )}
            <Link to={createPageUrl("Checklist")}>
              <Button variant="outline" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                View Checklist
              </Button>
            </Link>
            <Link to={createPageUrl("Reports")}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2">
                <FileText className="w-4 h-4" />
                Export Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Forget Dialog */}
        {showForgetDialog && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-red-900 mb-2">
                    Forget Saved Company Name?
                  </h3>
                  <p className="text-red-800 mb-4">
                    This will remove "{savedCompanyName}" from your browser's memory. 
                    You'll need to enter it again for future assessments.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowForgetDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleForget}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, Forget It
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Tier Badge */}
        <Card className={`border-2 ${
          activeAssessment.risk_tier === "High Risk" 
            ? "border-red-300 bg-red-50" 
            : "border-green-300 bg-green-50"
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className={`w-8 h-8 ${
                  activeAssessment.risk_tier === "High Risk" ? "text-red-600" : "text-green-600"
                }`} />
                <div>
                  <h3 className="font-bold text-lg">{activeAssessment.risk_tier} Classification</h3>
                  <p className="text-sm text-slate-600">
                    {formatAIFunction(activeAssessment.ai_function)} • 
                    {activeAssessment.involves_people_decisions ? " Involves people decisions" : " No people decisions"}
                  </p>
                </div>
              </div>
              <Badge className={`${
                activeAssessment.risk_tier === "High Risk" 
                  ? "bg-red-600" 
                  : "bg-green-600"
              } text-white px-4 py-2`}>
                {stats.mandatoryCompleted}/{stats.mandatoryTotal} Mandatory Items Complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Items
                </CardTitle>
                <ClipboardList className="w-4 h-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                <p className="text-xs text-slate-500 mt-1">Requirements tracked</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Completed
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
                <Progress value={(stats.completed / stats.total) * 100} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  In Progress
                </CardTitle>
                <Clock className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{stats.inProgress}</div>
                <Progress value={(stats.inProgress / stats.total) * 100} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  Not Started
                </CardTitle>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-700">{stats.notStarted}</div>
                <Progress value={(stats.notStarted / stats.total) * 100} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ReadinessScoreCard score={stats.readiness} riskTier={activeAssessment.risk_tier} />
            <CategoryProgress items={items} />
          </div>
          <div>
            <RecentActivity items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
