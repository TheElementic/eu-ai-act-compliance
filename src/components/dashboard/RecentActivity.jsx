import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ items }) {
  const getRecentItems = () => {
    return items
      .filter(item => item.updated_date)
      .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
      .slice(0, 8);
  };

  const recentItems = getRecentItems();

  const getStatusBadge = (status) => {
    const badges = {
      "Completed": { color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle2 },
      "In Progress": { color: "bg-blue-100 text-blue-700 border-blue-300", icon: Clock },
      "Not Started": { color: "bg-slate-100 text-slate-700 border-slate-300", icon: AlertCircle }
    };
    return badges[status] || badges["Not Started"];
  };

  return (
    <Card className="border-2 border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentItems.map((item) => {
            const badge = getStatusBadge(item.status);
            const StatusIcon = badge.icon;
            
            return (
              <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2 mb-2">
                  <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    item.status === "Completed" ? "text-green-600" : 
                    item.status === "In Progress" ? "text-blue-600" : 
                    "text-slate-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.article_reference}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-xs ${badge.color} border`}>
                    {item.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {format(new Date(item.updated_date), "MMM d, HH:mm")}
                  </span>
                </div>
              </div>
            );
          })}

          {recentItems.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}