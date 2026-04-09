import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit, Tag, AlertTriangle, Minus, ArrowDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  high: { 
    icon: AlertTriangle, 
    color: "border-r-red-500 dark:border-l-red-500", 
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    text: "عالية"
  },
  medium: { 
    icon: Minus, 
    color: "border-r-amber-500 dark:border-l-amber-500", 
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    text: "متوسطة"
  },
  low: { 
    icon: ArrowDown, 
    color: "border-r-green-500 dark:border-l-green-500", 
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    text: "منخفضة"
  },
};

export function TaskCard({ task }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tasks/${task.id}/complete`);
    },
    onSuccess: () => {
      setIsCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "تم إنجاز المهمة!",
        description: task.title,
      });
    },
    onError: (error) => {
      console.error("Error completing task:", error);
      toast({
        title: "خطأ",
        description: "فشل في إنجاز المهمة",
        variant: "destructive",
      });
    },
  });

  const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig];
  const PriorityIcon = priorityInfo.icon;

  const handleComplete = () => {
    if (!isCompleted) {
      completeMutation.mutate();
    }
  };

  return (
    <Card 
      className={`${priorityInfo.color} border-r-4 bg-slate-50 dark:bg-slate-700/50 transition-all duration-200 hover:shadow-md ${
        isCompleted ? "opacity-75" : ""
      }`}
      draggable
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleComplete}
            disabled={completeMutation.isPending}
            className="mt-1"
          />
          <div className="flex-1">
            <h4 className={`font-medium text-slate-900 dark:text-white ${
              isCompleted ? "line-through" : ""
            }`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
              {task.estimatedMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedMinutes} دقيقة</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>مهمة</span>
              </div>
              <Badge variant="secondary" className={`flex items-center gap-1 ${priorityInfo.badge}`}>
                <PriorityIcon className="w-3 h-3" />
                <span>{priorityInfo.text}</span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
