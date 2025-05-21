import React from 'react';

const ExportButton = () => {
    const handleExport = () => {
        window.location.href = './api/exportBranches'; // เรียก API เพื่อดาวน์โหลดไฟล์
    };

    return (
        <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-md mx-90 hover:bg-blue-700">
            Export to Excel
        </button>
    );
};

export default ExportButton;
