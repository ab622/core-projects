import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar, BarChart3, Brain, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">TaskFlow</h1>
          </div>
          
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary-600 hover:bg-primary-700"
          >
            تسجيل الدخول
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
          إدارة المهام والوقت
          <span className="block text-primary-600">بذكاء وفعالية</span>
        </h2>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          منصة شاملة تجمع بين إدارة المهام والجدولة التلقائية ومؤقت Pomodoro والتحليلات 
          لمساعدتك على تحقيق أقصى استفادة من وقتك
        </p>
        
        <Button 
          size="lg"
          onClick={() => window.location.href = "/api/login"}
          className="bg-primary-600 hover:bg-primary-700 px-8 py-4 text-lg"
        >
          ابدأ مجاناً الآن
        </Button>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
          الميزات الرئيسية
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-blue-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                إدارة المهام الذكية
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                إنشاء وتنظيم المهام بأولويات مختلفة مع تقدير الوقت المطلوب لكل مهمة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-green-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                الجدولة التلقائية
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                جدولة المهام تلقائياً في أفضل الأوقات المتاحة مع إمكانية إعادة التنظيم بالسحب والإفلات
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-purple-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                وضع التركيز
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                مؤقت Pomodoro متطور مع تتبع جلسات التركيز وإحصائيات الإنتاجية
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-amber-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                تتبع الوقت
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                تتبع دقيق للوقت المستغرق في كل مهمة ونشاط لفهم أفضل لأنماط عملك
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-red-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                تحليلات شاملة
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                رؤى عميقة حول إنتاجيتك ومعدل إنجاز المهام مع توصيات لتحسين الأداء
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-indigo-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                تجربة مستخدم متميزة
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                واجهة عربية أنيقة مع دعم الوضع الليلي والنهاري لتجربة مريحة في جميع الأوقات
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <Card className="bg-primary-600 border-primary-600">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              هل أنت مستعد لتنظيم وقتك بشكل أفضل؟
            </h3>
            <p className="text-primary-100 text-lg mb-8">
              انضم إلى آلاف المستخدمين الذين حسّنوا إنتاجيتهم مع TaskFlow
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 text-lg"
            >
              ابدأ رحلتك الآن
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 TaskFlow. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
