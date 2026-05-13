"use client";
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

import { experiences } from '@/data/experience';


export default function Experience() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Experience</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Real work, real systems, real pressure.
          </h1>
        </motion.div>

        <div className="relative space-y-8">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-border" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative pl-12 sm:pl-16"
            >
              <div className="absolute left-3 sm:left-4 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background" />

              <Card className="p-4 sm:p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground break-words">
                      {exp.role} · {exp.organization}
                    </h3>
                    {exp.location && <p className="text-sm text-muted-foreground mt-1">{exp.location}</p>}
                    {exp.dates && <p className="text-sm text-muted-foreground mt-1">{exp.dates}</p>}
                  </div>
                  {exp.isLatest && (
                    <Badge className="bg-primary text-primary-foreground">Current</Badge>
                  )}
                </div>
                <p className="text-foreground leading-relaxed mb-4">{exp.description}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Skills used:</span> {exp.skills}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
