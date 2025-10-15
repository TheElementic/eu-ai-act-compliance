import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Database, 
  FileText, 
  Clock, 
  Eye, 
  Users, 
  CheckCircle, 
  Lock 
} from "lucide-react";

export default function CategoryProgress({ items }) {
  const categories = {
    "Risk Management": { icon: Shield, color: "blue" },
    "Data Governance": { icon: Database, color: "green" },
    "Technical Documentation": { icon: FileText, color: "purple" },
    "Record Keeping": { icon: Clock, color: "orange" },
    "Transparency": { icon: Eye, color: "indigo" },
    "Human Oversight": { icon: Users, color: "pink" },
    "Accuracy & Robustness": { icon: CheckCircle, color: "teal" },
    "Cybersecurity": { icon: Lock, color: "red" }
  };

  const getCategoryStats = () => {
    return Object.keys(categories).map(category => {
      const categoryItems = items.filter(item => item.category === category);
      const completed = categoryItems.filter(item => item.status === "Completed").length;
      const total = categoryItems.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        name: category,
        completed,
        total,
        percentage,
        ...categories[category]
      };
    }).filter(cat => cat.total > 0);
  };

  const categoryStats = getCategoryStats();

  return (
    <Card className="border-2 border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Progress by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                  </div>
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-slate-500">
                      {category.completed} of {category.total} items
                    </p>
                  </div>
                </div>
                <Badge variant={category.percentage === 100 ? "default" : "outline"}>
                  {category.percentage}%
                </Badge>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}

          {categoryStats.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No compliance items yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}