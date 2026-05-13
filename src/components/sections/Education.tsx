"use client";
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

import { education } from '@/data/education';


export default function Education() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Education</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            University gave me the structure, projects gave me the understanding.
          </h1>
        </motion.div>

        <div className="relative space-y-8">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-border" />

          {education.map((edu, index) => (
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
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground break-words">
                      {edu.degree}
                    </h3>
                    {edu.institution && (
                      <p className="text-base text-muted-foreground mt-1">
                        {edu.institution}
                        {edu.location && ` · ${edu.location}`}
                      </p>
                    )}
                    {edu.dates && <p className="text-sm text-muted-foreground mt-1">{edu.dates}</p>}
                  </div>
                  {edu.isCurrent && (
                    <Badge className="bg-primary text-primary-foreground ml-4">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-foreground leading-relaxed">{edu.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
