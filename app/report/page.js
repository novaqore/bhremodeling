"use client";

import { db } from "@/lib/firebase/init";
import { onValue, ref, query } from "firebase/database";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function ReportPage() {
    const router = useRouter();
    const [requests, setRequests] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch all requests
    useEffect(() => {
        setLoading(true);
        const requestsRef = query(ref(db, "requests"));
        const unsubscribe = onValue(requestsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Requests:", data);
                setRequests(data);
            } else {
                console.log("No requests found.");
                setRequests({});
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Calculate totals from all requests
    const calculateTotals = () => {
        return Object.values(requests).reduce(
            (acc, request) => {
                acc.income += Number(request.requestAmount || 0);
                acc.bankFee += Number(request.bankFee || 0);
                acc.kickbackFee += Number(request.kickbackFee || 0);
                acc.processingFee += Number(request.processingFee || 0);
                acc.profit += Number(request.profit || 0);
                // Customer payout is treated as an expense
                acc.customerPayout += Number(request.customerPayout || 0);
                return acc;
            },
            {
                income: 0,
                bankFee: 0,
                kickbackFee: 0,
                processingFee: 0,
                profit: 0,
                customerPayout: 0,
            }
        );
    };

    const totals = calculateTotals();
    // Net Profit is now calculated by subtracting total expenses from income
    const totalExpenses = totals.bankFee + totals.kickbackFee + totals.processingFee + totals.customerPayout;
    const netProfit = totals.income - totalExpenses;

    // Format numbers as currency
    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    // Bar Chart Data (Income vs Expenses)
    const barChartData = {
        labels: ["Income", "Bank Fee", "Kickback Fee", "Processing Fee", "Customer Payout", "Net Profit"],
        datasets: [
            {
                label: "Amount in $",
                data: [
                    totals.income,
                    totals.bankFee,
                    totals.kickbackFee,
                    totals.processingFee,
                    totals.customerPayout,
                    netProfit,
                ],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Pie Chart Data (Expense Breakdown)
    const pieChartData = {
        labels: ["Bank Fee", "Kickback Fee", "Processing Fee", "Customer Payout"],
        datasets: [
            {
                data: [totals.bankFee, totals.kickbackFee, totals.processingFee, totals.customerPayout],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                ],
                hoverBackgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(255, 159, 64, 0.8)",
                ],
            },
        ],
    };

    // Breakdown for each fee (Bank Fee, Kickback Fee, Processing Fee, and Customer Payout)
    const feeDetails = [
        { label: "Bank Fee", amount: totals.bankFee },
        { label: "Kickback Fee", amount: totals.kickbackFee },
        { label: "Processing Fee", amount: totals.processingFee },
        { label: "Customer Payout", amount: totals.customerPayout },
    ];

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6 pt-20">
            {/* Header Section */}
            <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center pb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Profit and Loss Statement
                    </h1>
                </div>
            </div>

            {/* Total Summary at the Top */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(totals.income)}
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
                        <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalExpenses)}
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Net Profit</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(netProfit)}
                        </p>
                    </div>
                </div>
                {/* Breakdown of each fee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {feeDetails.map((fee, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                        >
                            <h4 className="text-sm font-semibold text-gray-700">{fee.label}</h4>
                            <p className="text-xl font-bold text-gray-800">
                                {formatCurrency(fee.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
                    <Bar data={barChartData} options={{ responsive: true }} />
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
                    <Pie data={pieChartData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
}
