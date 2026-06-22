"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, Code2, Award, GraduationCap, Mail, ChartColumn, Menu, X, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { profile } from '@/data/profile';

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Skills', path: '/skills', icon: Code2 },
  { name: 'Experience', path: '/experience', icon: Award },
  { name: 'Education', path: '/education', icon: GraduationCap },
  { name: 'Contact', path: '/contact', icon: Mail },
  { name: 'Stats', path: '/stats', icon: ChartColumn },
];

const ecosystemNav = [
  { name: 'Launchpad', path: '/launchpad', icon: Layers },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image 
                src="/brand/6ixtype_main_logo_transparent.png" 
                alt="6ixtype Logo" 
                fill 
                className="object-contain dark:invert"
              />
            </div>
            <span className="font-bold text-foreground">{profile.name}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-16">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-border">
              <p className="px-4 pb-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Ecosystem</p>
              {ecosystemNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
