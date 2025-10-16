import React, { useState } from "react";
import { api as base44 } from "../api/appApi";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Filter,
  Search
} from "lucide-react";

import ComplianceItemCard from "../components/checklist/ComplianceItemCard";

export default function Checklist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => base44.entities.Assessment.filter({ status: 'active' }, '-created_date', 1),
  });

  const activeAssessment = assessments[0];

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['compliance-items', activeAssessment?.id],
    queryFn: () => activeAssessment 
      ? base44.entities.ComplianceItem.filter({ assessment_id: activeAssessment.id })
      : [],
    enabled: !!activeAssessment,
  });

  const formatAIFunction = (aiFunction) => {
    // Replace underscores with spaces, then capitalize the first letter of each word
    const formatted = aiFunction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    // Specifically fix "Hr " to "HR "
    return formatted.replace('Hr ', 'HR ');
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.article_reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const mandatoryItems = filteredItems.filter(item => item.is_mandatory);
  const optionalItems = filteredItems.filter(item => !item.is_mandatory);

  const categories = [...new Set(items.map(item => item.category))];

  if (!activeAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-12">
          <h2 className="text-2xl font-bold mb-4">No Active Assessment</h2>
          <p className="text-slate-600">Complete an assessment to view your compliance checklist</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance Checklist</h1>
          <p className="text-slate-600 mt-1">
            {activeAssessment.company_name} • {activeAssessment.risk_tier}
          </p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by title, description, or article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-56">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                {items.filter(i => i.status === "Completed").length} Completed
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3 text-blue-600" />
                {items.filter(i => i.status === "In Progress").length} In Progress
              </Badge>
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="w-3 h-3 text-slate-600" />
                {items.filter(i => i.status === "Not Started").length} Not Started
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mandatory Items */}
        {mandatoryItems.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Mandatory Requirements</h2>
              <Badge className="bg-red-600 text-white">
                {mandatoryItems.filter(i => i.status === "Completed").length}/{mandatoryItems.length} Complete
              </Badge>
            </div>
            <div className="space-y-4">
              {mandatoryItems.map(item => (
                <ComplianceItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Optional Items */}
        {optionalItems.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Recommended Actions</h2>
              <Badge variant="outline">
                {optionalItems.filter(i => i.status === "Completed").length}/{optionalItems.length} Complete
              </Badge>
            </div>
            <div className="space-y-4">
              {optionalItems.map(item => (
                <ComplianceItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No items match your search criteria</p>
          </Card>
        )}
      </div>
    </div>
  );
}
