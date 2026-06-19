"use client";
import DataHero from "@/components/6data/landing/DataHero";
import DataLifecycle from "@/components/6data/landing/DataLifecycle";
import CapabilityGrid from "@/components/6data/landing/CapabilityGrid";
import UseCases from "@/components/6data/landing/UseCases";
import Roadmap from "@/components/6data/landing/Roadmap";
import DataCTA from "@/components/6data/landing/DataCTA";

export default function SixDataLanding() {
  return (
    <div className="min-h-screen">
      <DataHero />
      <DataLifecycle />
      <CapabilityGrid />
      <UseCases />
      <Roadmap />
      <DataCTA />
    </div>
  );
}
