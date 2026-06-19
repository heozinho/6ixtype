import type { Metadata } from "next";
import LaunchpadPage from "./LaunchpadPage";

export const metadata: Metadata = {
  title: "Launchpad — 6ixtype Ecosystem",
  description:
    "The official 6ixtype ecosystem hub. 6Stats, 6Data, 6Play and the 6ixtype portfolio — music analytics, data platforms and audio software.",
};

export default function Page() {
  return <LaunchpadPage />;
}
