import type { Metadata } from "next";
import SixDataLanding from "./SixDataLanding";

export const metadata: Metadata = {
  title: "6Data — Your data, understood.",
  description:
    "Import files, databases and app data. Profile, clean, query, visualise, research, learn from and render datasets from one workspace. The 6ixtype data platform.",
};

export default function Page() {
  return <SixDataLanding />;
}
