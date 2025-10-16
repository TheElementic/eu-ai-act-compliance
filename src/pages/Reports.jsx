import React, { useState } from "react";
import { api as base44 } from "@api/appApi";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  Shield,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => base44.entities.Assessment.filter({ status: 'active' }, '-created_date', 1),
  });

  const activeAssessment = assessments[0];

  const { data: items = [] } = useQuery({
    queryKey: ['compliance-items', activeAssessment?.id],
    queryFn: () => activeAssessment 
      ? base44.entities.ComplianceItem.filter({ assessment_id: activeAssessment.id })
      : [],
    enabled: !!activeAssessment,
  });

  const formatAIFunction = (aiFunction) => {
    // Replace underscores with spaces and capitalize each word
    const formatted = aiFunction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    // Specific fix for "Hr Automation" to "HR Automation"
    return formatted.replace('Hr ', 'HR ');
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    const completed = items.filter(i => i.status === "Completed").length;
    const totalWeight = items.reduce((sum, i) => sum + (i.weight || 1), 0);
    const completedWeight = items
      .filter(i => i.status === "Completed")
      .reduce((sum, i) => sum + (i.weight || 1), 0);
    const readiness = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

    const mandatoryItems = items.filter(i => i.is_mandatory);
    const completedMandatory = mandatoryItems.filter(i => i.status === "Completed");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
          }
          .header p {
            margin: 5px 0;
            opacity: 0.9;
          }
          .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
          }
          .high-risk { background: #fecaca; color: #991b1b; }
          .limited-risk { background: #bbf7d0; color: #166534; }
          .section {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
          }
          .section h2 {
            margin: 0 0 15px 0;
            font-size: 20px;
            color: #0f172a;
          }
          .score-circle {
            text-align: center;
            padding: 20px;
            margin: 20px 0;
          }
          .score-value {
            font-size: 72px;
            font-weight: bold;
            color: ${readiness >= 80 ? '#16a34a' : readiness >= 50 ? '#2563eb' : '#ea580c'};
          }
          .item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .item h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
          }
          .item-meta {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
          }
          .item-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .mandatory { background: #fecaca; color: #991b1b; }
          .article { background: #e0e7ff; color: #3730a3; }
          .category { background: #ddd6fe; color: #5b21b6; }
          .status-completed { background: #bbf7d0; color: #166534; }
          .status-progress { background: #bfdbfe; color: #1e40af; }
          .status-not-started { background: #f1f5f9; color: #475569; }
          .disclaimer {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
          }
          .disclaimer strong {
            color: #92400e;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          td:first-child {
            font-weight: 600;
            color: #64748b;
            width: 200px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛡️ EU AI Act Compliance Report</h1>
          <p><strong>${activeAssessment.company_name}</strong></p>
          <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' HH:mm")}</p>
          <span class="badge ${activeAssessment.risk_tier === "High Risk" ? "high-risk" : "limited-risk"}">
            ${activeAssessment.risk_tier}
          </span>
        </div>

        <div class="section">
          <h2>📊 Compliance Readiness Score</h2>
          <div class="score-circle">
            <div class="score-value">${readiness}%</div>
            <p style="color: #64748b; margin-top: 10px;">
              ${readiness >= 80 ? 'Excellent Progress' : readiness >= 50 ? 'Good Progress' : 'Needs Attention'}
            </p>
          </div>
          <table>
            <tr>
              <td>Total Requirements</td>
              <td><strong>${items.length}</strong></td>
            </tr>
            <tr>
              <td>Completed</td>
              <td><strong>${completed}</strong> (${Math.round((completed/items.length)*100)}%)</td>
            </tr>
            <tr>
              <td>Mandatory Completed</td>
              <td><strong>${completedMandatory.length} of ${mandatoryItems.length}</strong></td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>🏢 Assessment Details</h2>
          <table>
            <tr>
              <td>Company Name</td>
              <td>${activeAssessment.company_name}</td>
            </tr>
            <tr>
              <td>AI Function</td>
              <td>${formatAIFunction(activeAssessment.ai_function)}</td>
            </tr>
            <tr>
              <td>People Decisions</td>
              <td>${activeAssessment.involves_people_decisions ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Risk Tier</td>
              <td><strong>${activeAssessment.risk_tier}</strong></td>
            </tr>
            <tr>
              <td>Assessment Date</td>
              <td>${format(new Date(activeAssessment.completed_date), "MMMM d, yyyy")}</td>
            </tr>
          </table>
          <p style="margin-top: 15px; color: #64748b;">
            ${activeAssessment.company_description}
          </p>
        </div>

        <div class="section">
          <h2>✅ Compliance Items</h2>
          ${items.map(item => `
            <div class="item">
              <h3>${item.title}</h3>
              <div class="item-meta">
                ${item.is_mandatory ? '<span class="item-badge mandatory">Mandatory</span>' : ''}
                <span class="item-badge article">${item.article_reference}</span>
                <span class="item-badge category">${item.category}</span>
                <span class="item-badge status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span>
              </div>
              <p style="color: #64748b; margin: 8px 0;">${item.description}</p>
              ${item.evidence ? `<p style="margin-top: 10px;"><strong>Evidence:</strong> ${item.evidence}</p>` : ''}
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>🎯 Next Steps</h2>
          ${readiness < 100 ? `
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              ${items.filter(i => i.status === "Not Started" && i.is_mandatory).length > 0 ? 
                '<li>Complete all mandatory requirements marked in red</li>' : ''}
              ${items.filter(i => i.status === "In Progress").length > 0 ? 
                '<li>Finish items currently in progress</li>' : ''}
              ${items.filter(i => !i.evidence && i.status === "Completed").length > 0 ? 
                '<li>Document evidence for completed items</li>' : ''}
              <li>Regularly review and update compliance documentation</li>
              <li>Consult with legal counsel for final compliance verification</li>
            </ul>
          ` : `
            <p style="color: #166534;">
              ✅ Congratulations! All items are marked as complete. Continue maintaining your compliance documentation and stay updated on EU AI Act developments.
            </p>
          `}
        </div>

        <div class="disclaimer">
          <p><strong>⚠️ IMPORTANT LEGAL DISCLAIMER</strong></p>
          <p style="margin-top: 10px;">
            This EU AI Act Compliance Report is provided for informational and guidance purposes only. 
            It does not constitute legal advice and should not be relied upon as a substitute for 
            consultation with qualified legal counsel. The interpretation and application of the EU AI Act 
            may vary based on specific circumstances, jurisdictions, and regulatory guidance. 
          </p>
          <p style="margin-top: 10px;">
            This report represents a self-assessment based on the information provided. Formal compliance 
            certification may require additional documentation, third-party audits, and conformity assessment 
            procedures. Always consult with legal professionals and regulatory experts for compliance decisions.
          </p>
          <p style="margin-top: 10px; font-style: italic;">
            Generated by EU AI Act Compliance Assistant v1.0
          </p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EU-AI-Act-Compliance-Report-${activeAssessment.company_name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  if (!activeAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-12">
          <h2 className="text-2xl font-bold mb-4">No Active Assessment</h2>
          <p className="text-slate-600">Complete an assessment to generate reports</p>
        </Card>
      </div>
    );
  }

  const stats = {
    completed: items.filter(i => i.status === "Completed").length,
    total: items.length,
    mandatoryCompleted: items.filter(i => i.is_mandatory && i.status === "Completed").length,
    mandatoryTotal: items.filter(i => i.is_mandatory).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance Reports</h1>
          <p className="text-slate-600 mt-1">Export your compliance status and evidence</p>
        </div>

        <Card className="border-2 border-slate-200 shadow-xl">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">PDF Compliance Report</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive report with assessment results, checklist, and evidence
                </CardDescription>
              </div>
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-lg">Report Includes</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Company & Assessment Details
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Risk Tier Classification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Readiness Score & Progress
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Complete Checklist with Status
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Evidence Documentation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Next Steps & Recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Legal Disclaimer
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-lg">Current Status</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Company</p>
                      <p className="font-semibold">{activeAssessment.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Risk Tier</p>
                      <Badge className={`${
                        activeAssessment.risk_tier === "High Risk" ? "bg-red-600" : "bg-green-600"
                      } text-white`}>
                        {activeAssessment.risk_tier}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Progress</p>
                      <p className="font-semibold">
                        {stats.completed}/{stats.total} items complete
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Mandatory Items</p>
                      <p className="font-semibold">
                        {stats.mandatoryCompleted}/{stats.mandatoryTotal} complete
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Note:</strong> The report will be generated as an HTML file that can be opened in any browser 
                  and printed as a PDF. This format ensures maximum compatibility and professional formatting.
                </AlertDescription>
              </Alert>

              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-6 text-lg gap-2"
              >
                {isGenerating ? (
                  "Generating Report..."
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Compliance Report
                  </>
                )}
              </Button>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-900">
                  <strong>Legal Disclaimer:</strong> This report is for guidance purposes only and does not constitute legal advice. 
                  The report includes a full disclaimer section. Always consult with qualified legal counsel for compliance decisions.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>Report Preview Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-sm text-slate-600">Total Items</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                  <p className="text-sm text-slate-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">
                    {items.filter(i => i.status === "In Progress").length}
                  </p>
                  <p className="text-sm text-slate-600">In Progress</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">
                    {items.filter(i => i.status === "Not Started").length}
                  </p>
                  <p className="text-sm text-slate-600">Not Started</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
