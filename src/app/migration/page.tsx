"use client";
import ExportButton from "@/components/ExportButton";
import ImportForm from "@/components/ImportForm";

export default function Migration() {
    return (
        <div className="flex flex-col justify-center min-h-screen w-full bg-gray-700 p-4 pb-20 gap-16 sm:p-20">
            <ImportForm />
            <ExportButton />
        </div>
    )
}