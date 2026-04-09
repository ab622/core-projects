import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

interface CalendarEvent {
  id: string;
  title: string;
  color: string;
  type: "task" | "meeting" | "event";
}

interface CalendarProps {
  tasks?: any[];
}

export function Calendar({ tasks = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const getWeekDays = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const formatDateRange = () => {
    const weekDays = getWeekDays();
    const start = weekDays[0];
    const end = weekDays[6];
    
    return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const weekDays = getWeekDays();
  const today = new Date();

  // Mock events for demonstration
  const mockEvents: Record<string, CalendarEvent[]> = {
    [weekDays[0].toDateString()]: [
      { id: "1", title: "اجتماع فريق العمل", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", type: "meeting" }
    ],
    [weekDays[1].toDateString()]: [
      { id: "2", title: "كتابة المقال", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", type: "task" },
      { id: "3", title: "مراجعة الكود", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", type: "task" }
    ],
    [weekDays[2].toDateString()]: [
      { id: "4", title: "تقرير المشروع", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", type: "task" },
      { id: "5", title: "مراجعة البريد", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", type: "task" }
    ],
    [weekDays[4].toDateString()]: [
      { id: "6", title: "عرض العميل", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", type: "meeting" }
    ],
  };

  return (
    <Card className="bg-white dark:bg-slate-800">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              التقويم الأسبوعي
            </CardTitle>
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="text-xs px-3 py-1"
              >
                أسبوع
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="text-xs px-3 py-1"
              >
                شهر
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('next')}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-slate-900 dark:text-white px-4">
              {formatDateRange()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((date, index) => {
            const dateStr = date.toDateString();
            const isToday = date.toDateString() === today.toDateString();
            const events = mockEvents[dateStr] || [];

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border rounded-lg transition-colors ${
                  isToday
                    ? "border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
                onDrop={(e) => {
                  e.preventDefault();
                  // Handle task drop
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? "text-primary-700 dark:text-primary-300" : "text-slate-900 dark:text-white"
                }`}>
                  {date.getDate()}
                  {isToday && <span className="text-xs mr-1">(اليوم)</span>}
                </div>
                <div className="space-y-1">
                  {events.map((event) => (
                    <Badge
                      key={event.id}
                      variant="secondary"
                      className={`text-xs px-2 py-1 rounded cursor-move hover:shadow-sm transition-shadow ${event.color}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", event.id);
                      }}
                    >
                      {event.title}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
