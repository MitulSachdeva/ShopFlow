import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      className="w-full flex items-center justify-center space-x-2 px-4 py-2"
      data-testid="button-theme-toggle"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span>Light Mode</span>
        </>
      )}
    </Button>
  );
}
