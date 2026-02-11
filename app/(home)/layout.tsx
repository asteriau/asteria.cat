import type { ReactNode } from "react";
import ProfileCard from "@/components/home/ProfileCard";

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-8 items-left justify-center gap-4 mt-4">
      <ProfileCard />
      {children}
    </div>
  );
}
