// components/ImportForm.tsx
import { useState } from "react";

const ImportForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("กรุณาเลือกไฟล์ Excel ก่อน");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/importBranches", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("นำเข้าข้อมูลสำเร็จ!");
                setFile(null);
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || "เกิดข้อผิดพลาดในการนำเข้า");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("อัปโหลดล้มเหลว");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">นำเข้าข้อมูลสต็อกจาก Excel</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {file && (
                    <div className="text-sm text-gray-600 truncate">
                        📎 ไฟล์ที่เลือก: <strong>{file.name}</strong>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                    {isUploading ? "กำลังอัปโหลด..." : "Import to Excel"}
                </button>
            </form>
        </div>
    );
};

export default ImportForm;
