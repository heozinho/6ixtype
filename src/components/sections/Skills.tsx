"use client";
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

import { skillCategories } from '@/data/skills';


export default function Skills() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Skills & Tools</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Learned through projects, uni work and fixing real problems.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
            {"I work mostly across full-stack web development, databases, backend systems, dashboards and practical software tooling. I'm strongest when building useful interfaces connected to real data and workflows."}
          </p>
        </motion.div>

        <div className="space-y-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: categoryIndex * 0.15, duration: 0.5 }}
            >
              <Card className="p-4 sm:p-6 hover:border-primary/50 transition-colors">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-foreground">{category.category}</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.15 + skillIndex * 0.05, duration: 0.3 }}
                    >
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default whitespace-nowrap"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
