import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-800/90 border-slate-200/30 dark:border-slate-700/30 rounded-2xl w-12 h-12 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-700" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}