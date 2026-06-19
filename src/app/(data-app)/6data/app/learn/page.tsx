'use client';
import Link from 'next/link';
import { GraduationCap, ArrowRight, BookOpen, Database, Filter } from 'lucide-react';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';

const lessons = [
  {
    slug: 'intro-to-sql',
    title: 'Intro to SQL with your data',
    description: 'Learn the basics of SELECT and WHERE using your own datasets.',
    icon: Database,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    slug: 'understanding-outliers',
    title: 'Understanding Outliers',
    description: 'How to spot and filter out anomalies in your data.',
    icon: Filter,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    slug: 'data-quality-nulls',
    title: 'Dealing with Missing Data',
    description: 'What happens when a cell is empty? Learn to handle nulls.',
    icon: BookOpen,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10'
  }
];

export default function LearnPage() {
  const { datasets } = useDatasetStore();

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Learning Mode</h1>
          <p className="text-sm text-white/40">Learn data science and SQL using your actual data.</p>
        </div>
      </div>

      {datasets.length === 0 && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
          <strong>Tip:</strong> Import a dataset first to make these lessons interactive and relevant to your own data!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          const Icon = lesson.icon;
          return (
            <Link
              key={lesson.slug}
              href={`/6data/app/learn/${lesson.slug}`}
              className="group flex flex-col bg-[#0f0f18] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg ${lesson.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${lesson.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
              <p className="text-sm text-white/40 mb-6 flex-1">
                {lesson.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                Start Lesson
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
