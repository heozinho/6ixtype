"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, Code2, Award, GraduationCap, Mail, BarChart3, Code, Link2, FileText, Moon, Sun, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';
import { profile } from '@/data/profile';

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Skills & Tools', path: '/skills', icon: Code2 },
  { name: 'Experience', path: '/experience', icon: Award },
  { name: 'Education', path: '/education', icon: GraduationCap },
  { name: 'Contact', path: '/contact', icon: Mail },
  { name: 'Stats', path: '/stats', icon: BarChart3 },
];

const ecosystemNav = [
  { name: 'Launchpad', path: '/launchpad', icon: Layers },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">GS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{profile.name}</span>
            <span className="text-xs text-muted-foreground">Portfolio</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-border">
          <p className="px-3 pb-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Ecosystem</p>
          {ecosystemNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 space-y-3 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="flex-1"
            onClick={() => window.open('https://linkedin.com', '_blank')}
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-1"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-1"
            onClick={() => window.open('#', '_blank')}
          >
            <FileText className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="w-4 h-4 mr-2 hidden dark:block" />
          <Moon className="w-4 h-4 mr-2 block dark:hidden" />
          <span className="hidden dark:inline">Light Mode</span>
          <span className="inline dark:hidden">Dark Mode</span>
        </Button>
      </div>
    </aside>
  );
}
