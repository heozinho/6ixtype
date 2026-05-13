"use client";
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Briefcase, Award, TrendingUp, Building2, MapPin, Languages, Code2, Target } from 'lucide-react';

import { portfolioStats, personalStats } from '@/data/stats';

export default function Stats() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">6ixtype</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">About this portfolio</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Insights and metrics about my portfolio, projects and development journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-base sm:text-lg break-words">{stat.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mb-2 break-words">{stat.value}</p>
                    <CardDescription className="break-words">{stat.caption}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="pt-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Personal & Career Stats</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Background, focus areas and career direction
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                >
                  <Card className="hover:border-primary/50 transition-colors h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-muted shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground font-semibold break-words">{stat.label}</p>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-foreground mb-2 break-words">{stat.value}</p>
                      <p className="text-sm text-muted-foreground break-words">{stat.caption}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
