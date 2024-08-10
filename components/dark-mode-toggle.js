'use client';

import useDarkMode from '@/hooks/use-dark-mode';
import Button from './button';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ defaultTheme = 'dark' }) {
  const { theme, toggleTheme } = useDarkMode(defaultTheme);

  return (
    <Button variant='ghost' size='sm' onClick={toggleTheme}>
      {theme === 'light' ? (
        <Moon className='w-6 h-6' />
      ) : (
        <Sun className='w-6 h-6' />
      )}
    </Button>
  );
}
