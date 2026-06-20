"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Home, User, Briefcase, Code2, Award, GraduationCap, Mail, ChartColumn } from 'lucide-react';

const sections = [
  { name: 'Introduction', path: '/', icon: Home },
  { name: 'About Me', path: '/about', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Skills & Tools', path: '/skills', icon: Code2 },
  { name: 'Experience', path: '/experience', icon: Award },
  { name: 'Education', path: '/education', icon: GraduationCap },
  { name: 'Contact', path: '/contact', icon: Mail },
  { name: 'Stats', path: '/stats', icon: ChartColumn },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search sections..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Sections">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <CommandItem
                key={section.path}
                onSelect={() => {
                  router.push(section.path);
                  setOpen(false);
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{section.name}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
