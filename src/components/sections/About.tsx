"use client";
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">About Me</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            More than a student portfolio, this showcases my development journey.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-card border-border hover:border-primary/50 transition-colors">
            <p className="text-base sm:text-base sm:text-lg text-foreground leading-relaxed">
              {profile.description}
            </p>

            <p className="text-base sm:text-base sm:text-lg text-foreground leading-relaxed">
              My background is a mix of university projects, personal builds and real workplace experience. I currently work in operational support at Magnavale, a large frozen warehouse environment, where I deal with customer service, driver reception, stock reports, invoicing preparation, EDI-fed orders and warehouse data through systems like ProWMS and Excel.
            </p>

            <p className="text-base sm:text-base sm:text-lg text-foreground leading-relaxed">
              That experience has made me more interested in building software that fixes messy real-world workflows. Things like holiday dashboards, stock tools, admin panels, internal reporting systems and better interfaces for teams that still rely on emails, spreadsheets and manual approvals.
            </p>

            <p className="text-base sm:text-base sm:text-lg text-foreground leading-relaxed">
              {"I'm building this portfolio as the front for my work, projects and future software ideas. It represents the type of developer I'm trying to become: someone who can take an idea, understand the user problem, design the interface, build the system and improve it into something usable."}
            </p>

            <p className="text-base sm:text-base sm:text-lg text-foreground leading-relaxed">
              My current focus is improving my full-stack skills, building stronger projects, learning backend and DevOps properly, and becoming ready for internships, placements and junior developer roles.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
