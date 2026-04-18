"use client";
import dynamic from "next/dynamic";

const LightRaysComponent = dynamic(() => import("./Grainient"), {
  ssr: false,
});

export default function GrainientLoader() {
  return <LightRaysComponent className="fixed inset-0 -z-20" />;
}
