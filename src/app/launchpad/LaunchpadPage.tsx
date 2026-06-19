"use client";
import LaunchpadHero from "@/components/launchpad/LaunchpadHero";
import LaunchpadGrid from "@/components/launchpad/LaunchpadGrid";

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen p-6 sm:p-8 md:p-10">
      <div className="max-w-5xl mx-auto py-8 sm:py-12">
        <LaunchpadHero />
        <LaunchpadGrid />
      </div>
    </div>
  );
}
