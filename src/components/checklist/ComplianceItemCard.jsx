
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComplianceItemCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [evidence, setEvidence] = useState(item.evidence || "");
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: (updates) => base44.entities.ComplianceItem.update(item.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-items'] });
    },
  });

  const handleStatusChange = (newStatus) => {
    updateItemMutation.mutate({ status: newStatus });
  };

  const handleEvidenceSave = () => {
    updateItemMutation.mutate({ evidence });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await updateItemMutation.mutateAsync({ evidence_file_url: file_url });
    setIsUploading(false);
  };

  const getStatusIcon = () => {
    if (item.status === "Completed") return CheckCircle2;
    if (item.status === "In Progress") return Clock;
    return AlertCircle;
  };

  const getStatusColor = () => {
    if (item.status === "Completed") return "border-green-300 bg-green-50";
    if (item.status === "In Progress") return "border-blue-300 bg-blue-50";
    return "border-slate-200 bg-white";
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className={`border-2 ${getStatusColor()} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.status === "Completed" ? "bg-green-100" :
                item.status === "In Progress" ? "bg-blue-100" :
                "bg-slate-100"
              }`}>
                <StatusIcon className={`w-5 h-5 ${
                  item.status === "Completed" ? "text-green-600" :
                  item.status === "In Progress" ? "text-blue-600" :
                  "text-slate-400"
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  {item.is_mandatory && (
                    <Badge className="bg-red-600 text-white text-xs">Mandatory</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">{item.article_reference}</Badge>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Select value={item.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2"
              >
                {isExpanded ? (
                  <>Hide Details <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Add Evidence <ChevronDown className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 pt-6 border-t border-slate-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Evidence & Notes
                  </label>
                  <Textarea
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    placeholder="Document your compliance efforts, evidence, and implementation details..."
                    className="min-h-32"
                  />
                  <Button
                    onClick={handleEvidenceSave}
                    disabled={evidence === (item.evidence || "")}
                    className="mt-2"
                    size="sm"
                  >
                    Save Notes
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Supporting Documents
                  </label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      />
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        disabled={isUploading}
                        onClick={(e) => e.currentTarget.previousElementSibling.click()}
                      >
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Uploading..." : "Upload File"}
                      </Button>
                    </label>
                  </div>
                  
                  {item.evidence_file_url && (
                    <a
                      href={item.evidence_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium flex-1">
                        View uploaded document
                      </span>
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
