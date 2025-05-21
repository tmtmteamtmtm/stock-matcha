// src/app/page.tsx
// หน้า Home
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;

  if (!session) return null; // หรือ loading indicator

  return (
    <div>
      {/* เนื้อหาของ dashboard ที่ต้องล็อกอิน */}
      สวัสดี {session.user?.email}
    </div>
  );
}