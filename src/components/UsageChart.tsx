"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ProductUsage = {
    productName: string;
    usedQty: number;
};

type BranchUsage = {
    branchName: string;
    products: ProductUsage[];
};

export default function BranchProductUsageChart() {
    const [data, setData] = useState<BranchUsage[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchUsage() {
            try {
                const res = await fetch("/api/usage/branch-products");
                const json: BranchUsage[] = await res.json();
                setData(json);
            } catch (err) {
                console.error("Failed to fetch usage data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsage();
    }, []);

    if (loading) return <div>Loading chart...</div>;

    // หาชื่อ product ทั้งหมด (unique)
    const allProducts = Array.from(
        new Set(data.flatMap((branch) => branch.products.map((p) => p.productName)))
    );

    // สร้าง datasets สำหรับแต่ละ product โดย mapping แต่ละ branch มาใส่ usedQty
    const datasets = allProducts.map((productName, idx) => ({
        label: productName,
        data: data.map((branch) => {
            const product = branch.products.find((p) => p.productName === productName);
            return product ? product.usedQty : 0;
        }),
        backgroundColor: getColor(idx),
        barThickness: 20,
    }));

    const chartData = {
        labels: data.map((branch) => branch.branchName),
        datasets,
    };

    let delayed = false;

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "ยอดใช้สินค้าตามสาขา" },
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
        },
        datasets: {
            bar: {
                categoryPercentage: 0.4,
                barPercentage: 0.6,
            },
        },
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context: any) => {
                let delay = 0;
                if (context.type === "data" && context.mode === "default" && !delayed) {
                    delay = context.dataIndex * 100 + context.datasetIndex * 50;
                }
                return delay;
            },
        },
    };


    function getColor(index: number) {
        const colors = [
            "rgba(75,192,192,0.7)",
            "rgba(255,99,132,0.7)",
            "rgba(255,206,86,0.7)",
            "rgba(54,162,235,0.7)",
            "rgba(153,102,255,0.7)",
            "rgba(255,159,64,0.7)",
        ];
        return colors[index % colors.length];
    }

    return <Bar options={options} data={chartData} />;
}
