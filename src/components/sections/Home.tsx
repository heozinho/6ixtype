"use client";
import { Button } from '../ui/button';
import { Mail, Download, ArrowDown, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { profile } from '@/data/profile';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {profile.name}
            </motion.h1>

            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Building practical software from real problems.
            </motion.h2>

            <motion.div
              className="text-lg text-muted-foreground leading-relaxed max-w-3xl space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p>
                {"I'm a Computer Science student at Nottingham Trent University and a junior full-stack developer focused on building useful web apps, dashboards and tools that solve actual problems."}
              </p>
              <p>
                My portfolio is also the front for <span className="text-primary font-semibold">6ixtype</span>, a software identity I build projects under, focused around practical products, clean interfaces and real-world systems. My work sits between web development, data, logistics tech, automation and user-focused dashboards.
              </p>
              <p>
                {"I've worked with React, Next.js, TypeScript, JavaScript, Python, C++, MySQL and modern web tools. I'm also building projects around Spotify data, warehouse systems, internal dashboards, Minecraft server tooling and software ideas that can grow into real SaaS products."}
              </p>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => window.open('#', '_blank')}
            >
              <Download className="w-5 h-5 mr-2" />
              Get Resume
            </Button>

            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                View Projects
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = `mailto:${profile.email}`}
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Mail
            </Button>
          </motion.div>

          <motion.div
            className="pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="font-medium">Explore More</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
