"use client";
import dynamic from "next/dynamic";

const GrainientComponent = dynamic(() => import("./Grainient"), {
  ssr: false,
});

export default function GrainientLoader() {
  return <GrainientComponent className="fixed inset-0 -z-20" />;
}
