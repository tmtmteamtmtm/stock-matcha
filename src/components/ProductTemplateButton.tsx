// // src/app/components/ProductTemplateButton.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@headlessui/react";
// import { PlusIcon } from "@heroicons/react/20/solid";

// type ProductTemplate = {
//   id: number;
//   name: string;
//   quantity: number;
// };

// type Props = {
//   onSelectTemplate: (template: ProductTemplate) => void;
// };

// export default function ProductTemplateButton({ onSelectTemplate }: Props) {
//   const [templates, setTemplates] = useState<ProductTemplate[]>([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   // ฟังก์ชันดึงข้อมูล Product Templates จาก API
//   const fetchProductTemplates = async () => {
//     const res = await fetch("/api/product-templates");
//     const data = await res.json();
//     setTemplates(data);
//   };

//   useEffect(() => {
//     fetchProductTemplates();
//   }, []);

//   const handleCreateTemplate = async () => {
//     const templateName = prompt("Enter a name for the new template:");
//     if (!templateName) return;

//     const res = await fetch("/api/product-templates", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: templateName, quantity: 0 }), // ใช้ quantity เริ่มต้น 0
//     });

//     if (res.ok) {
//       fetchProductTemplates(); // รีเฟรชรายการ template
//     } else {
//       alert("Failed to create template.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <Button
//         onClick={handleCreateTemplate}
//         className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-blue-300 ring-inset hover:bg-blue-700"
//       >
//         สร้าง Product Template
//         <PlusIcon aria-hidden="true" className="h-5 w-5 text-white" />
//       </Button>

//       <div className="space-y-2 mt-4">
//         <h3 className="font-semibold text-lg">เลือก Product Template</h3>
//         {templates.map((template) => (
//           <Button
//             key={template.id}
//             onClick={() => onSelectTemplate(template)}
//             className="block w-full text-left rounded-md px-3 py-2 border border-gray-300 shadow-sm bg-white hover:bg-gray-100"
//           >
//             {template.name} (Quantity: {template.quantity})
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }
