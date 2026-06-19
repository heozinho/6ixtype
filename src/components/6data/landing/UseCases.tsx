"use client";
import { motion } from "framer-motion";

const userTypes = [
  {
    icon: "📊",
    title: "Personal Analytics",
    subtitle: "Anyone with data",
    description:
      "Upload Spotify history, spending CSVs, sleep data or habit trackers. Get charts, insights and dashboards from your own life data.",
    examples: ["Spotify listening history", "Spending CSV", "Sleep tracker", "Game stats"],
    accent: "#06b6d4",
  },
  {
    icon: "🎓",
    title: "Student / Learner",
    subtitle: "Learning data skills",
    description:
      "Learn SQL, data cleaning, statistics and chart selection using your own datasets. Dataset-aware lessons adapt to what you've uploaded.",
    examples: ["SQL basics", "Data cleaning", "Statistics", "Chart selection"],
    accent: "#8b5cf6",
  },
  {
    icon: "🔬",
    title: "Research User",
    subtitle: "Reproducible workflows",
    description:
      "Create structured research projects with question, hypothesis, datasets, methods, findings and markdown export. Full reproducibility log included.",
    examples: ["Research question", "Dataset cleaning", "Analysis", "Report export"],
    accent: "#10b981",
  },
  {
    icon: "💻",
    title: "Developer",
    subtitle: "Technical data work",
    description:
      "Connect Postgres, Supabase, SQLite or REST APIs. Run SQL directly, explore schemas, save queries and export results.",
    examples: ["Postgres", "Supabase", "SQLite upload", "JSON APIs"],
    accent: "#f59e0b",
  },
  {
    icon: "🎨",
    title: "Creator",
    subtitle: "Visual outputs",
    description:
      "Build impressive dashboards, 3D data explorations, polished renders and shareable data visuals for portfolios and presentations.",
    examples: ["3D scatter plots", "Data Orb renders", "Audio DNA", "Dashboards"],
    accent: "#ec4899",
  },
];

export default function UseCases() {
  return (
    <section className="py-20 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-semibold text-cyan-400/60 uppercase tracking-widest mb-3">
            Who It's For
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Five types of data people
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            6Data is designed to be genuinely useful at every skill level — from first CSV to reproducible research to 3D renders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {userTypes.map((user, i) => (
            <motion.div
              key={user.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group relative p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all duration-300"
            >
              {/* Accent line top */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                style={{ background: `linear-gradient(90deg, ${user.accent}40, transparent)` }}
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{user.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white/85">{user.title}</h3>
                  <p className="text-xs text-white/35">{user.subtitle}</p>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed mb-4">{user.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {user.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-[10px] px-2 py-0.5 rounded-md border font-medium"
                    style={{
                      borderColor: `${user.accent}30`,
                      color: user.accent,
                      backgroundColor: `${user.accent}10`,
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
