"use client";

import UsageChart from "@/components/UsageChart";

export default function Statistics() {
  return (
    <div>
      <div className="flex flex-col justify-center min-h-screen w-full bg-gray-700 p-4 pb-20 gap-16 sm:p-20">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 sm:p-6 mx-auto">
          <h1 className="text-2xl font-bold mb-4">Statistics</h1>
          <UsageChart />
        </div>
      </div>
    </div>

  );
}