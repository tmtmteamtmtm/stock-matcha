"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            console.log("Login response:", res);

            if (res?.error) {
                setErrorMsg("Login failed: " + res.error);
            } else {
                router.push("/dashboard"); // เปลี่ยน path หลัง login สำเร็จ
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMsg("Unexpected error: " + (error instanceof Error ? error.message : String(error)));
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-700 p-4 sm:p-6 mx-auto">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h2>
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-600 rounded">{errorMsg}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-md py-2 font-semibold"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
