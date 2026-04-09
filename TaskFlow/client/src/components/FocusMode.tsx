import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Play, Pause, X, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
}

export function FocusMode({ isOpen, onClose, taskId }: FocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/focus-sessions", {
        duration: 25,
        startedAt: new Date().toISOString(),
        taskId: taskId || null,
      });
      return response.json();
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      setIsRunning(true);
      toast({
        title: "بدأت جلسة التركيز",
        description: "25 دقيقة من التركيز العميق",
      });
    },
    onError: (error) => {
      console.error("Error starting focus session:", error);
      toast({
        title: "خطأ",
        description: "فشل في بدء جلسة التركيز",
        variant: "destructive",
      });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      if (sessionId) {
        await apiRequest("POST", `/api/focus-sessions/${sessionId}/complete`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/focus-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "تم إنجاز جلسة التركيز!",
        description: "أحسنت! لقد أكملت 25 دقيقة من التركيز العميق",
      });
      resetTimer();
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            if (sessionId) {
              completeSessionMutation.mutate();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionId, completeSessionMutation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!sessionId) {
      startSessionMutation.mutate();
    } else {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setSessionId(null);
  };

  const handleClose = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    onClose();
  };

  return (
    <>
      {/* Focus Mode Card */}
      <Card className="bg-gradient-to-l from-primary-600 to-primary-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">وضع التركيز</h3>
              <p className="text-primary-100 mb-4">ابدأ جلسة Pomodoro للتركيز العميق</p>
              <Button
                onClick={() => {
                  if (!isOpen) {
                    // Open the modal if it's not already open
                    onClose(); // This will be handled by parent to open modal
                  } else {
                    startTimer();
                  }
                }}
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                disabled={startSessionMutation.isPending}
              >
                <Play className="w-4 h-4 ml-2" />
                ابدأ التركيز
              </Button>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{formatTime(timeLeft)}</div>
              <div className="text-primary-200 text-sm">
                {isRunning ? "قيد التشغيل" : "جاهز للبدء"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Mode Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md mx-4 bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="text-primary-600 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">وضع التركيز</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">جلسة Pomodoro - 25 دقيقة تركيز عميق</p>
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary-600 mb-8">
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex gap-4 justify-center">
              {!isRunning ? (
                <Button
                  onClick={startTimer}
                  disabled={startSessionMutation.isPending}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3"
                >
                  <Play className="w-4 h-4 ml-2" />
                  <span>ابدأ</span>
                </Button>
              ) : (
                <Button
                  onClick={pauseTimer}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3"
                >
                  <Pause className="w-4 h-4 ml-2" />
                  <span>إيقاف</span>
                </Button>
              )}
              
              <Button
                onClick={resetTimer}
                variant="outline"
                className="px-6 py-3"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                <span>إعادة تعيين</span>
              </Button>
              
              <Button
                onClick={handleClose}
                variant="outline"
                className="px-6 py-3"
              >
                <X className="w-4 h-4 ml-2" />
                <span>إغلاق</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
